const mongoose = require("mongoose");
const { jobDb } = require("../utils/db");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

module.exports = jobDb.model("User", UserSchema);
