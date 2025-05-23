const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500', // Match with frontend URL
    methods: ['GET', 'POST']
  }
});
app.use(cors())
let chatHistory = [];
let users = {}; // Map socket.id => username

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('register', (username) => {
    users[socket.id] = username;

    // Send chat history only after registering
    socket.emit('chatHistory', chatHistory);
  });

  socket.on('sendMessage', (text) => {
    const message = {
      id: socket.id,
      name: users[socket.id] || 'Anonymous',
      message: text
    };
    chatHistory.push(message);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
