
const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./models/todo");
const app = express();
const PORT = 3000;
// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todoDB");

// Routes
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const newTodo = new Todo({ task: req.body.task, completed: false });
  await newTodo.save();
  res.status(201).json(newTodo);
});

app.put("/todos/:id", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTodo);
});

app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

app.get("/posts", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
  });
  
  app.post("/posts", async (req, res) => {
    const newTodo = new Todo({ task: req.body.task, completed: false });
    await newTodo.save();
    res.status(201).json(newTodo);
  });
  
  app.put("/posts/:id", async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTodo);
  });
  
  app.delete("/posts/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; 