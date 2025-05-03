// models/Booking.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    expiryDate: { type: String, required: true },
    receiptId: { type: String, required: true },
}, { _id: false }); // Disable _id generation for the embedded schema

const BookingSchema = new mongoose.Schema({
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    selectedDate: { type: Date, required: true },
    payment: { type: PaymentSchema, required: true },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Booking', BookingSchema);
