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
}

class GameServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);
    this.players = {};
    this.bulletRadius = 0.5;
    this.playerRadius = 1.5;

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
    this.checkBulletCollisions(shooterId, bulletData);
    socket.broadcast.emit("playerShot", { shooterId, bulletData });
  }

  checkBulletCollisions(shooterId, bulletData) {
    const bulletPosition = new THREE.Vector3(
      bulletData.position.x,
      bulletData.position.y,
      bulletData.position.z
    );

    Object.keys(this.players).forEach((id) => {
      if (id !== shooterId) {
        const player = this.players[id];
        const distance = bulletPosition.distanceTo(player.position);
        if (distance < this.bulletRadius + this.playerRadius) {
          console.log(`Player ${shooterId} hit Player ${id}`);

          // Emit an event to inform clients about the hit
          this.io.emit("bulletHit", { shooterId, targetId: id });

          // Optionally, handle hit detection, like reducing health
          player.health -= 10; // Example: reduce health by 10
          if (player.health <= 0) {
            console.log(
              `Player ${id} has been eliminated by Player ${shooterId}`
            );
            // Emit an event for player elimination
            this.io.emit("playerEliminated", { shooterId, targetId: id });
          }
        }
      }
    });
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
