const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  nic: {
    type: String,
    required: true,
    unique: true // Ensure NIC is unique
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
