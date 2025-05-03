// controllers/packageController.js

const Package = require('../models/package'); // Import your Package model

// Function to decrease the max customers for a package
const decreaseMaxCustomers = async (req, res) => {
    try {
        const packageId = req.params.id;

        // Find the package and decrease the max customers
        const updatedPackage = await Package.findByIdAndUpdate(
            packageId,
            { $inc: { maxCustomers: -1 } }, // Decrease maxCustomers by 1
            { new: true } // Return the updated document
        );

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found.' });
        }

        res.status(200).json(updatedPackage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    decreaseMaxCustomers,
    // ... other exports
};
