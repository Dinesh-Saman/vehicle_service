const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    date: String,
    timeSlot1: String,
    availability1: String,
    timeSlot2: String,
    availability2: String,
    timeSlot3: String,
    availability3: String,
    task: String,
    trainee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'trainee_details' } // Reference to the trainee ID
});

const ScheduleModel = mongoose.model('schedule_details', ScheduleSchema);
module.exports = ScheduleModel;
