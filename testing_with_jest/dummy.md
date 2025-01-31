const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../index");
const UserModel = require("../models/user.model");

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/nemtest", { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Authentication Tests", () => {
  let user;
  let token;

  test("Signup - Hashes password & creates user", async () => {
    const response = await request(app).post("/signup").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123"
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("johndoe@example.com");

    // Fetch user from DB
    user = await UserModel.findOne({ email: "johndoe@example.com" });
    expect(user).toBeDefined();

    // Ensure password is hashed
    const isMatch = await bcrypt.compare("password123", user.password);
    expect(isMatch).toBe(true);
  });

  test("Login - Validates user & returns JWT", async () => {
    const response = await request(app).post("/login").send({
      email: "johndoe@example.com",
      password: "password123"
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token; // Store token for later tests
  });

  test("Login - Fails with incorrect password", async () => {
    const response = await request(app).post("/login").send({
      email: "johndoe@example.com",
      password: "wrongpassword"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  test("Protected Route - Fails without JWT", async () => {
    const response = await request(app).get("/protected-route");
    expect(response.status).toBe(401);
  });

  test("Protected Route - Succeeds with valid JWT", async () => {
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });
});

