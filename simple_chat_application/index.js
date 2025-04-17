const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// In-memory store
const onlineUsers = new Map(); // userName → socket.id
const chats = []; // [{ fromUsername, toUsername, content, timestamp }]

io.on('connection', (socket) => { 
  console.log('User connected:', socket.id);

  // Register user
  socket.on('register', (username) => {
    onlineUsers.set(username, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.entries()));
  });

  // Private messaging
  socket.on('privateMessage', ({ fromUsername, toUsername, content }) => {
    const timestamp = new Date().toISOString();

    // Save chat in memory
    chats.push({ fromUsername, toUsername, content, timestamp });

    const toSocketId = onlineUsers.get(toUsername);
    if (toSocketId) {
      io.to(toSocketId).emit('newMessage', { fromUsername, content, timestamp });
    }
  });

  // Send chat history between two users
  socket.on('getChatHistory', ({ userA, userB }) => {
    const history = chats.filter(
      msg =>
        (msg.fromUsername === userA && msg.toUsername === userB) ||
        (msg.fromUsername === userB && msg.toUsername === userA)
    );
    socket.emit('chatHistory', history);
  });

  // On disconnect
  socket.on('disconnect', () => {
    for (const [username, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(username);
        break;
      }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.entries()));
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
