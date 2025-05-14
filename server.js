// File: server.js
"use strict";
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// Routes
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const carRoutes = require("./routes/carData");

// Initialize environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB (via utils/db.js)
require("./utils/db");

// Middleware: CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, req.body || "");
  next();
});

// routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.use("/car", carRoutes);
app.use("/api/car", carRoutes);

// JWT authentication middleware for protected endpoints
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ message: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

app.use("/jobs", authenticateJWT, jobRoutes);
app.use("/api/jobs", authenticateJWT, jobRoutes);

// Health check
app.get("/", (req, res) => res.send("API is running"));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
