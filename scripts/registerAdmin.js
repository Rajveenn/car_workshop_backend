const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(
    "mongodb+srv://anbaa:Rj2U2AkuKf5UWZ1x@master.v3hazyp.mongodb.net/?retryWrites=true&w=majority&appName=master",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const exists = await User.findOne({ email: "rjnflix1@gmail.com" });
  if (exists) return console.log("Admin already exists");

  const hash = await bcrypt.hash("11111111", 10);
  const admin = new User({
    email: "rjnflix1@gmail.com",
    password: hash,
    isAdmin: true,
  });
  await admin.save();

  console.log("Admin created:", admin);
  process.exit();
}

createAdmin();
