// File: models/job.js
const mongoose = require("mongoose");
const { jobDb } = require("../utils/db");

// Sub-document schema for individual job details
const JobDetailSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, default: 1, min: 0 },
  cost: { type: Number, required: true, min: 0 },
});

// Main Job schema
const JobSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    carModel: { type: String, required: true },
    year: { type: String, required: true },
    plateNumber: { type: String, required: true },
    jobDetails: [JobDetailSchema],
    labourCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    jobDate: { type: Date, required: true },
    whatsappUrl: { type: String },
    pdfUrl: { type: String },
    invoiceNumber: { type: String, default: 0 },
    status: {
      type: String,
      enum: ["PJPP", "PP", "PJ", "Completed"],
      default: "PJPP",
    },
    editCount: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Export model using the jobDb connection
module.exports = jobDb.model("Job", JobSchema);
