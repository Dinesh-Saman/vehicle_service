// Import required packages
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Ensure mongoose is imported
const User = require('../models/User'); // Make sure this model is correctly defined
const authenticateToken = require('../middleware/authMiddleware'); // Middleware for authentication

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, vehicleType } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password || !vehicleType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, vehicleType });

        // Save the new user to the database
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'jwtSecret', { expiresIn: '30d' });

        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users (Protected route)
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select('username email vehicleType');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// View a specific user (Protected route)
router.get('/users/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username email vehicleType');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile (Protected route)
router.put('/users/:id', authenticateToken, async (req, res) => {
    const { username, email, vehicleType } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            username,
            email,
            vehicleType
        }, { new: true });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset password (Protected route)
router.put('/reset-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Check if both passwords are provided
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

        // Hash the new password and save it
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a user account (Protected route)
router.delete('/users/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;
