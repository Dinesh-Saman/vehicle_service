const { time } = require('console')
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerName: String,
  vehicleModel: String,
  serviceType: [String], // Change to accept an array of strings
  appointmentDate: String,
  appointmentTime: String,
  Phonenumber: String,
  email: String,
  createdAt: { type: Date, default: Date.now }, // Add this line
});

const appointmentModel = mongoose.model("user_information", appointmentSchema);
module.exports = appointmentModel;

