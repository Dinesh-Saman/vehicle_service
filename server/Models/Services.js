const mongoose = require ('mongoose')
const UserShema = new mongoose.Schema({
    service: String,
    date: String,
    vin: String,
    price: Number,
    parts: String,
    quantity: Number,
    notes: String
})

const ServiceModel = mongoose.model("Service_Records",UserShema)
module.exports = ServiceModel