const express = require("express");
const router = express.Router();
const Package = require("../models/package");

// Create package - POST http://localhost:3001/package/add
router.post("/add", async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        await newPackage.save();
        res.status(200).json({ message: "Package Added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while adding package" });
    }
});

// Read all packages - GET http://localhost:3001/package/
router.get("/", async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while fetching packages" });
    }
});

// Update package - PUT http://localhost:3001/package/update/:id
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedPackage = await Package.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Package Updated", package: updatedPackage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while updating package" });
    }
});

// Delete package - DELETE http://localhost:3001/package/delete/:id
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Package.findByIdAndDelete(id);
        res.status(200).json({ message: "Package Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while deleting package" });
    }
});

// Get package by ID - GET http://localhost:3001/package/get/:id
router.get("/get/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const pkg = await Package.findById(id);
        if (pkg) {
            res.status(200).json({ message: "Package Fetched", pkg });
        } else {
            res.status(404).json({ error: "Package not found" });
        }
    } catch (err) {
        console.error("Error fetching package:", err);
        res.status(500).json({ error: "Error occurred while fetching package" });
    }
});



module.exports = router;
