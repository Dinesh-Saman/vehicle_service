const mongoose = require("mongoose");

// Define user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
    trim: true,   // Trim leading/trailing spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
    trim: true,   // Trim leading/trailing spaces
    lowercase: true, // Ensure emails are stored in lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Enforce a minimum password length
  },
  vehicleType: {
    type: String,
    required: true, // Make this field required
    trim: true,     // Trim leading/trailing spaces
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the User model
const User = mongoose.model("User2", userSchema);
module.exports = User;
