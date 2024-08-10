const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = {};
const bullets = [];

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Add new player
  players[socket.id] = {
    position: { x: 0, y: 0, z: 0 },
  };

  // Send current players to the new player
  socket.emit("currentPlayers", players);

  // Broadcast new player to all other clients
  socket.broadcast.emit("newPlayer", {
    id: socket.id,
    position: players[socket.id].position,
  });

  // Log current players
  console.log("Current players:", players);

  // Handle player shooting
  socket.on("shoot", (data) => {
    const bulletData = {
      position: data.position,
      velocity: data.velocity,
    };
    bullets.push(bulletData);
    console.log(`Player ${socket.id} shot a bullet:`, bulletData);
    socket.broadcast.emit("playerShot", { bulletData });
  });

  // Handle player movement
  socket.on("playerMoved", (position) => {
    players[socket.id].position = position;
    console.log(`Player ${socket.id} moved to position:`, position);
    socket.broadcast.emit("playerMoved", { id: socket.id, position });
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
    console.log("Current players:", players);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
