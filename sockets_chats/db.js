// =================== BACKEND (Node.js + Express + Socket.io + Redis + MongoDB) ===================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const cron = require('node-cron');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500', // Adjust if needed
    methods: ['GET', 'POST']
  }
});

const redisClient = new Redis();
const ALL_CHATS_KEY = 'allChats';
const TO_PUSH_CHATS_KEY = 'toPushChats';

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/chatApp');

const chatSchema = new mongoose.Schema({
  name: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// Middleware
app.use(cors());

// API to fetch chat history
app.get('/chats', async (req, res) => {
  const data = await redisClient.lrange(ALL_CHATS_KEY, 0, -1);
  const chats = data.map(JSON.parse);
  res.json(chats);
});

// Socket connection
io.on('connection', (socket) => {
  let userName = '';

  socket.on('register', (name) => {
    userName = name;
  });

  socket.on('sendMessage', async (msg) => {
  const chatObj = {
    name: userName || socket.id,
    message: msg,
    timestamp: new Date()
  };

  const strChat = JSON.stringify(chatObj);
  await redisClient.rpush(ALL_CHATS_KEY, strChat);
  await redisClient.rpush(TO_PUSH_CHATS_KEY, strChat);

  // Get full chat history
  const chatData = await redisClient.lrange(ALL_CHATS_KEY, 0, -1);
  const chatHistory = chatData.map(JSON.parse);

  // Send updated chat history to all clients
  io.emit('chatHistory', chatHistory);
});
});

// Cron to run every 2 mins
cron.schedule('*/2 * * * *', async () => {
  console.log("Cron started")
  const toPush = await redisClient.lrange(TO_PUSH_CHATS_KEY, 0, -1);
  if (toPush.length) {
    const parsedChats = toPush.map(JSON.parse);
    await Chat.insertMany(parsedChats);
  }

  // Clear Redis lists
  await redisClient.del(ALL_CHATS_KEY);
  await redisClient.del(TO_PUSH_CHATS_KEY);

  // Load last 15 from DB
  const latest = await Chat.find().sort({ timestamp: -1 }).limit(15);
  const ordered = latest.reverse();
  for (let chat of ordered) {
    await redisClient.rpush(ALL_CHATS_KEY, JSON.stringify(chat));
  }

  console.log("Cron Ended")
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
