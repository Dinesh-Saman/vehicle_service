// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Fetch all bookings
router.get('/all', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('packageId', 'packageName price'); // Populate package details
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings: ' + error.message });
    }
});

// Add a new booking
router.post('/add', async (req, res) => {
    const { packageId, selectedDate, payment } = req.body;

    const newBooking = new Booking({
        packageId,
        selectedDate,
        payment,
    });

    try {
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error saving booking: ' + error.message });
    }
});

// Delete a booking by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking: ' + error.message });
    }
});

module.exports = router;
