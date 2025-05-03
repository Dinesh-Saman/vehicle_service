// models/ProgressModel.js
const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  trainee_id: { type: mongoose.Schema.Types.ObjectId, ref: "trainee_details", required: true }, // Reference to trainee
  attendance: { type: Number, required: true },
  tasks: {
    oilChanging: { type: Number, default: 0 },
    wheelAlignment: { type: Number, default: 0 },
    batteryService: { type: Number, default: 0 },
    airConditioning: { type: Number, default: 0 },
    interiorService: { type: Number, default: 0 },
    hybridService: { type: Number, default: 0 },
  }
});

const ProgressModel = mongoose.model("progress_details", ProgressSchema);
module.exports = ProgressModel;
