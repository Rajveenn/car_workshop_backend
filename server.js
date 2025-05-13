// File: server.js (or index.js)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Logger middleware (logs method, URL, body)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, req.body || "");
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected")).catch(err => console.error("MongoDB error", err));

// Auth routes
// Support both /auth and /api/auth for login/register
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

// JWT authentication middleware for protected routes
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "Missing token" });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// Job routes (protected)
// GET /jobs, POST /jobs, etc.
app.use("/jobs", authenticateJWT, jobRoutes);
app.use("/api/jobs", authenticateJWT, jobRoutes);

// Healthcheck
app.get("/", (req, res) => res.send("API is running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
