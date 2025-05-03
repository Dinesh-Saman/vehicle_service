const mongoose= require('mongoose')

const UserSchema =  new mongoose.Schema({
    
    trainee_id : String,
    name : String,
    age: Number,
    trainee_periode: String,
    email: String,
    phone_number: String
})

const TraineeModel = mongoose.model("trainee_details",UserSchema)
module.exports = TraineeModel