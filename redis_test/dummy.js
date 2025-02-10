const express = require("express");
const Redis = require("ioredis");
const mongoose = require("mongoose");
const cron = require("node-cron");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const redis = new Redis();
const PORT = 3000;

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/emphertodoDB");

const TodoSchema = new mongoose.Schema({
  userId: String,
  todos: [String],
});

const TodoModel = mongoose.model("Todo", TodoSchema);

// GET Todos - First check Redis, then MongoDB
app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;

  // 1️⃣ Check Redis first
  const userData = await redis.get(`todos:${userId}`);
  if (userData) {
    const { getTodos } = JSON.parse(userData);
    return res.json({ source: "Redis Cache", todos: getTodos });
  }

  // 2️⃣ Fetch from MongoDB if not found in Redis
  const mongoData = await TodoModel.find({ userId });

  if (mongoData) {
    const fetchedTodos = mongoData;

    // 3️⃣ Store in Redis for future requests
    const redisData = { getTodos: fetchedTodos, postingTodos: [] };
    await redis.set(`todos:${userId}`, JSON.stringify(redisData), "EX", 300);

    return res.json({ source: "MongoDB", todos: fetchedTodos });
  }

  return res.json({ message: "No todos found." });
});

// POST Todo - Store in Redis first (under postingTodos)
app.post("/todos", async (req, res) => {
  const { userId, todo } = req.body;

  if (!userId || !todo) {
    return res.status(400).json({ error: "User ID and todo are required" });
  }

  let userData = await redis.get(`todos:${userId}`);
  userData = userData
    ? JSON.parse(userData)
    : { getTodos: [], postingTodos: [] };

  userData.postingTodos.push(todo);
  await redis.set(`todos:${userId}`, JSON.stringify(userData), "EX", 300); // Expires after 5 mins

  res.json({
    message: "Todo stored in Redis, will be pushed to MongoDB soon.",
  });
});

// Cron Job: Move all postingTodos from Redis to MongoDB every 2 minutes
cron.schedule("*/1 * * * *", async () => {
    console.log("Running Cron Job...");
  
    const keys = await redis.keys("todos:*");
    console.log("Keys Found:", keys);
  
    for (let key of keys) {
      const userId = key.split(":")[1];
      const userDataString = await redis.get(key);
  
      if (userDataString) {
        let userData = JSON.parse(userDataString);
        console.log(`Processing user: ${userId}, Pending Todos: ${userData.postingTodos.length}`);
  
        if (userData.postingTodos.length > 0) {
          console.log(`Inserting ${userData.postingTodos.length} todos for user ${userId} into MongoDB`);
  
          // Store todos in MongoDB
          await TodoModel.create({ userId, todos: userData.postingTodos });
  
          // 🛠 **Fix: Update the original `userData` object directly**
          userData.getTodos.push(...userData.postingTodos);
          userData.postingTodos = []; // Clear the posted todos
  
          // Store updated data back in Redis
          await redis.set(key, JSON.stringify(userData), "EX", 300);
          console.log(`✅ Moved todos of user ${userId} to MongoDB & updated Redis`);
        }
      }
    }
  });
  

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
