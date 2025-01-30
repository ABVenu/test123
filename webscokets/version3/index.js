const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static("public")); // mw

let rooms = {}; // To store chat history for each room

let adminSocket = null;
let clients = new Map();

io.on("connection", (socket) => {
  console.log("connected to the client", `${socket.id}`);
  socket.emit("client_id", socket.id);

  socket.on("register", (role) => {
    if (role == "admin") {
      adminSocket = socket;
      console.log("Admin connected");
    } else {
      clients.set(socket.id, socket);
      console.log("client connected", socket.id);
    }
  });

  socket.on("private_message", ({ to, message }) => {
    let msgData = { from: socket.id, message };
    if (to === "admin" && adminSocket) {
      adminSocket.emit("message", msgData);
    }
    console.log(msgData);
  });

  socket.on("broadcast_message", (message) => {
    // Admin broadcasting a message to all clients
    if (adminSocket && socket.id === adminSocket.id) {
      clients.forEach((clientSocket) => {
        clientSocket.emit("message", {
          from: "admin",
          message,
        });
      });
    }
  });

  socket.on("room_message", ({ roomNumber, message }) => {
    let msgData = { from: socket.id, message };

    // Initialize the room's chat history if not already initialized
    if (!rooms[roomNumber]) {
      rooms[roomNumber] = [];
    }

    rooms[roomNumber].push(msgData); // Store message in room's chat history

    // Emit the updated chat history to everyone in that room
    io.to(roomNumber).emit("updateChatHistory", rooms[roomNumber]);
    console.log(msgData);
  });

  socket.on("join_room", (roomNumber) => {
    socket.join(roomNumber);
    console.log("client joined room:", roomNumber);
    // Send the chat history for that room to the client who just joined
    if (rooms[roomNumber]) {
      socket.emit("updateChatHistory", rooms[roomNumber]);
    }
  });

  socket.on("disconnect", () => {
    clients.delete(socket.id);
    console.log(socket.id, "disconnected");
  });
});

server.listen(9000, () => {
  console.log("server started");
});
