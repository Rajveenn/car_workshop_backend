const mongoose = require("mongoose");

const JobDetailSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  cost: { type: Number, required: true },
});

const JobSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  carModel: { type: String, required: true },
  plateNumber: { type: String, required: true },
  jobDetails: [JobDetailSchema],
  labourCost: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  jobDate: { type: Date, required: true },
  whatsappUrl: { type: String },
  pdfUrl: { type: String },
  invoiceNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
