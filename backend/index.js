const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { isNil } = require("ramda");
const router = require("./router");

const Room = require("./objects/Room");
const roomManager = require("./lib/roomManager");
const socketManager = require("./lib/socketManager");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: true,
  origins: ["https://localhost:3000"],
});

app.use(router);

io.on("connect", (socket) => {
  console.log(`${socket.id} connected!`);

  // Join room handler
  socket.on("join", ({ name, room }, callback) => {
    // Check if room exists in room manager
    if (room in roomManager) {
      // Add player to existing room
      const existingRoom = roomManager[room];
      const { error, result } = existingRoom.addPlayer({
        id: socket.id,
        name,
      });
      if (!isNil(error)) {
        return callback({ error });
      }
      socket.join(room);
      socketManager[socket.id] = room;
      io.to(room).emit("room", {
        room: existingRoom,
      });

      return callback({ user: result });
    } else {
      // Create new room
      roomManager[room] = new Room(name);
      const { error, result } = roomManager[room].addPlayer({
        id: socket.id,
        name,
      });
      if (!isNil(error)) {
        return callback({ error });
      }
      socket.join(room);
      socketManager[socket.id] = room;
      io.to(room).emit("room", {
        room: roomManager[room],
      });
      return callback({ user: result });
    }
  });

  // Player Ready Handler
  socket.on("playerReady", ({ room }, callback) => {
    // Check if room exists in room manager
    if (room in roomManager) {
      // Get Room object
      const existingRoom = roomManager[room];
      const { result, error } = existingRoom.setPlayerReady({ id: socket.id });
      if (!isNil(error)) {
        return callback({ error });
      }
      io.to(room).emit("room", {
        room: existingRoom,
      });
      return callback({ user: result });
    }
    return callback({
      error: `Room: ${room} does not exist`,
    });
  });

  // Player Change Character Handler
  socket.on(
    "playerChangeCharacter",
    ({ room, selectedCharacterID }, callback) => {
      // Check if room exists in room manager
      if (room in roomManager) {
        // Get Room object
        const existingRoom = roomManager[room];
        const { result, error } = existingRoom.changeCharacter({
          id: socket.id,
          selectedCharacterID: selectedCharacterID,
        });
        if (!isNil(error)) {
          return callback({ error });
        }
        io.to(room).emit("room", {
          room: existingRoom,
        });
        return callback({ user: result });
      }
      return callback({
        error: `Room: ${room} does not exist`,
      });
    }
  );

  socket.on("disconnect", () => {
    const room = socketManager[socket.id];
    console.log(`${socket.id} disconnected from room: ${room}.`);
    // Check if room exists in room manager
    if (room in roomManager) {
      // Get Room object
      const existingRoom = roomManager[room];
      const { result, error } = existingRoom.removePlayer({ id: socket.id });
      if (!isNil(error)) {
        return;
      }
      delete socketManager[socket.id];
      io.to(room).emit("room", {
        room: existingRoom,
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
