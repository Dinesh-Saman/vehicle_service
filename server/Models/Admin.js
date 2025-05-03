const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define admin schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  jobCategory: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
