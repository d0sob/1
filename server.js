const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const THREE = require("three"); // Import THREE library

class Player {
  constructor(id) {
    this.id = id;
    this.position = new THREE.Vector3(0, 74, 52);
    this.health = Player.initialHealth;
  }

  static initialHealth = 100;

  move(position) {
    this.position.set(position.x, position.y, position.z);
  }

  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }

  respawn() {
    this.health = Player.initialHealth;
    this.position.set(0, 74, 52); // Respawn position
  }
}

class GameServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);
    this.players = {};

    this.app.use(express.static(path.join(__dirname)));

    this.io.on("connection", (socket) => this.onConnection(socket));
  }

  onConnection(socket) {
    console.log("A user connected:", socket.id);
    const newPlayer = new Player(socket.id);
    this.players[socket.id] = newPlayer;

    socket.emit("currentPlayers", this.players);
    socket.broadcast.emit("newPlayer", newPlayer);

    socket.on("playerMove", (data) => this.onPlayerMove(socket, data));
    socket.on("shoot", (bulletData) => this.onShoot(socket, bulletData));
    socket.on("playerHit", ({ playerId }) => this.onPlayerHit(playerId));
    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  onPlayerMove(socket, data) {
    const player = this.players[socket.id];
    if (player) {
      player.move(data.position);
      socket.broadcast.emit("playerMoved", player);
    }
  }

  onShoot(socket, bulletData) {
    const shooterId = socket.id;
    socket.broadcast.emit("playerShot", { shooterId, bulletData });

    for (const playerId in this.players) {
      if (playerId !== shooterId) {
        const player = this.players[playerId];
        const bulletPosition = new THREE.Vector3(
          bulletData.position.x,
          bulletData.position.y,
          bulletData.position.z
        );
        const distanceSquared =
          player.position.distanceToSquared(bulletPosition);
        if (distanceSquared < 1) {
          if (player.takeDamage(2)) {
            this.respawnPlayer(playerId);
          } else {
            this.io
              .to(playerId)
              .emit("updateHealth", { health: player.health });
          }
        }
      }
    }
  }

  onPlayerHit(playerId) {
    const player = this.players[playerId];
    if (player && player.takeDamage(2)) {
      this.respawnPlayer(playerId);
    } else {
      this.io.to(playerId).emit("updateHealth", { health: player.health });
    }
  }

  respawnPlayer(playerId) {
    const player = this.players[playerId];
    player.respawn();
    this.io.emit("playerDied", playerId);
  }

  onDisconnect(socket) {
    console.log("A user disconnected:", socket.id);
    delete this.players[socket.id];
    this.io.emit("playerDisconnected", socket.id);
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}

const gameServer = new GameServer();
gameServer.start(3000);
