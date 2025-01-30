const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Todo = require("../models/todo");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/todoDB");
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("should create a new todo", async () => {
  const res = await request(app).post("/todos").send({ task: "Test Task" });
  expect(res.statusCode).toBe(201);
  expect(res.body.task).toBe("Test Task");
});

test("should get all todos", async () => {
  const res = await request(app).get("/todos");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBeTruthy();
});

test("should update a todo", async () => {
  const todo = new Todo({ task: "Update Task", completed: false });
  await todo.save();
  const res = await request(app).put(`/todos/${todo._id}`).send({ completed: true });
  expect(res.statusCode).toBe(200);
  expect(res.body.completed).toBe(true);
});

test("should delete a todo", async () => {
  const todo = new Todo({ task: "Delete Task", completed: false });
  await todo.save();
  const res = await request(app).delete(`/todos/${todo._id}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Todo deleted");
});