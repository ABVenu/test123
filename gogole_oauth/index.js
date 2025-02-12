require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("./config/passport"); // Load Passport config
const app = express();
// MongoDB connection
mongoose.connect("mongodb://localhost:27017/oauth-demo");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Google OAuth with Node.js</h1>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {session:false}),
//   (req, res) => {
//     res.json({ token: req.user.token });  // Respond with the generated JWT token
//   }
// );

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`<h1>Welcome ${req.user.name}</h1>`);
});

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({
        message: "This is your dashboard",
        data: {
          name: req.user.name,
          email: req.user.email,
          lastLogin: req.user.lastLogin, // Example custom field
        },
      });
    } else {
      res.status(403).json({
        message: "Access denied. Please log in to view the dashboard.",
      });
    }
  });

// Start the server
app.listen(8080, () => {
  console.log("Server running on http://localhost:3000");
});
