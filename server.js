const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Logger middleware (must be before routes)
app.use((req, res, next) => {
  if (req.body != undefined)
    console.log(`${req.method} ${req.originalUrl}`, req.body);
  else {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
});

mongoose.connect(
  "mongodb+srv://anbaa:Rj2U2AkuKf5UWZ1x@master.v3hazyp.mongodb.net/?retryWrites=true&w=majority&appName=master",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Routes
app.use("/api/auth", authRoutes);

app.use(
  "/api/jobs",
  (req, res, next) => {
    // console.log(req.headers.authorization)
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token)
    if (!token) return res.status(401).send("Missing token");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).send("Invalid token");
      req.user = user;
      next();
    });
  },
  jobRoutes
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
