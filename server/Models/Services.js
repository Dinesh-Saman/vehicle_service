const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Update the schema to include whatsappNumber and serviceId
const UserShema = new mongoose.Schema({
    serviceId: String,
    service: String,
    date: String,
    vin: String,
    price: Number,
    parts: String,
    quantity: Number,
    notes: String,
    whatsappNumber: String,
    status: String
})

const ServiceModel = mongoose.model("Service_Records", UserShema)
module.exports = ServiceModel

