const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageSchema = new Schema({
    packageName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Basic', 'Standard', 'Premium'], // Example categories
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number, // Duration in minutes or hours
        required: true
    },
    maxCustomers: {
        type: Number,
        required: true
    },
    termsAndConditions: {
        type: String,
        required: true
    }
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
