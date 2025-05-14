// File: models/carData.js
const mongoose = require("mongoose");
const { carDb } = require("../utils/db");

// Schema for car makes and their models
const CarDataSchema = new mongoose.Schema({
  make: { type: String, required: true, unique: true },
  models: { type: [String], required: true },
});

// Export model using the carDb connection
module.exports = carDb.model("CarData", CarDataSchema);
