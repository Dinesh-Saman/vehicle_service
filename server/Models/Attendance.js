const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee',
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String,
    required: true 
  },
  overtimeHours: {
    type: Number,
    default: 0  // Default to 0 if OT is not provided
  }
});



const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
