const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const THREE = require("three"); // Import THREE library

class Player {
  constructor(id) {
    this.id = id;
    this.position = new THREE.Vector3(0, 74, 52);
    this.modelData = {}; // Placeholder for model-specific data
  }

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

    this.app.use(express.static(path.join(__dirname)));

    this.io.on("connection", (socket) => this.onConnection(socket));
  }

  onConnection(socket) {
    console.log("A user connected:", socket.id);
    const newPlayer = new Player(socket.id);
    this.players[socket.id] = newPlayer;

    // Send the current players and their model data to the new player
    socket.emit("currentPlayers", this.getPlayersModelData());

    // Broadcast new player to other clients
    socket.broadcast.emit("newPlayer", this.getPlayerModelData(newPlayer));

    socket.on("playerMove", (data) => this.onPlayerMove(socket, data));
    socket.on("shoot", (bulletData) => this.onShoot(socket, bulletData));
    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  onPlayerMove(socket, data) {
    const player = this.players[socket.id];
    if (player) {
      player.move(data.position);
      // Broadcast updated player data to all clients
      socket.broadcast.emit("playerMoved", this.getPlayerModelData(player));
    }
  }

  onShoot(socket, bulletData) {
    const shooterId = socket.id;
    // Broadcast shooting event with shooter ID and bullet data
    socket.broadcast.emit("playerShot", { shooterId, bulletData });
  }

  onDisconnect(socket) {
    console.log("A user disconnected:", socket.id);
    delete this.players[socket.id];
    // Notify all clients of the disconnection
    this.io.emit("playerDisconnected", socket.id);
  }

  getPlayersModelData() {
    const data = {};
    for (const id in this.players) {
      data[id] = this.getPlayerModelData(this.players[id]);
    }
    return data;
  }

  getPlayerModelData(player) {
    return {
      id: player.id,
      position: player.position,
      modelData: player.modelData, // Placeholder for model data
    };
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}

const gameServer = new GameServer();
gameServer.start(3000);
