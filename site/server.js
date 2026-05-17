// D:\Dev\mini-site\site\server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// fichiers statiques (frontend)
app.use(express.static("public"));

/* =========================
   ÉTAT EN MÉMOIRE (ROOMS)
========================= */

const rooms = {};

/* =========================
   POKÉMONS SIMPLES
========================= */

const POKEMONS = [
  ["Pikachu", "Raichu"],
  ["Bulbizarre", "Herbizarre"],
  ["Salamèche", "Reptincel"]
];

function pickPair() {
  return POKEMONS[Math.floor(Math.random() * POKEMONS.length)];
}

/* =========================
   SOCKET.IO
========================= */

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // -------------------------
  // CREATE ROOM
  // -------------------------
  socket.on("createRoom", ({ roomId, name, password }) => {

    rooms[roomId] = {
      host: socket.id,
      password: password || null,
      players: [],
      state: "lobby",
      round: 0,
      order: [],
      spyId: null,
      votes: {},
      scores: { team: 0, spy: 0 }
    };

    socket.join(roomId);

    rooms[roomId].players.push({
      id: socket.id,
      name,
      ready: false
    });

    io.to(roomId).emit("roomUpdate", rooms[roomId]);
  });

  // -------------------------
  // JOIN ROOM
  // -------------------------
  socket.on("joinRoom", ({ roomId, name, password }) => {

    const room = rooms[roomId];
    if (!room) return socket.emit("error", "Room inexistante");

    if (room.password && room.password !== password)
      return socket.emit("error", "Mauvais mot de passe");

    socket.join(roomId);

    room.players.push({
      id: socket.id,
      name,
      ready: false
    });

    io.to(roomId).emit("roomUpdate", room);
  });

  // -------------------------
  // READY
  // -------------------------
  socket.on("setReady", ({ roomId }) => {

    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    player.ready = true;

    io.to(roomId).emit("roomUpdate", room);
  });

  // -------------------------
  // START GAME (HOST ONLY)
  // -------------------------
  socket.on("startGame", (roomId) => {

    const room = rooms[roomId];
    if (!room) return;

    if (room.host !== socket.id) return;

    const [normal, spy] = pickPair();

    const spyIndex = Math.floor(Math.random() * room.players.length);
    room.spyId = room.players[spyIndex].id;

    room.players.forEach(p => {
      p.pokemon = (p.id === room.spyId) ? spy : normal;
    });

    room.order = [...room.players].sort(() => Math.random() - 0.5);
    room.state = "playing";
    room.round = 1;

    io.to(roomId).emit("gameStart", room);
  });

  // -------------------------
  // WORD (tour)
  // -------------------------
  socket.on("word", ({ roomId, word }) => {

    io.to(roomId).emit("newWord", {
      playerId: socket.id,
      word
    });
  });

  // -------------------------
  // CHAT
  // -------------------------
  socket.on("chat", ({ roomId, name, msg }) => {

    io.to(roomId).emit("chat", { name, msg });
  });

});

server.listen(80, () => {
  console.log("Server running on port 80");
});