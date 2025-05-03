const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier"); // Adjust the path as necessary

// Create supplier - POST http://localhost:3001/supplier/add
router.post("/add", async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while adding supplier" });
    }
});

// Read all suppliers - GET http://localhost:3001/supplier/
router.get("/", async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while fetching suppliers" });
    }
});

// Update supplier - PUT http://localhost:3001/supplier/update/:id
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (updatedSupplier) {
            res.status(200).json({ message: "Supplier updated successfully", supplier: updatedSupplier });
        } else {
            res.status(404).json({ error: "Supplier not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while updating supplier" });
    }
});

// Delete supplier - DELETE http://localhost:3001/supplier/delete/:id
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        if (deletedSupplier) {
            res.status(200).json({ message: "Supplier deleted successfully" });
        } else {
            res.status(404).json({ error: "Supplier not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while deleting supplier" });
    }
});

// Get supplier by ID - GET http://localhost:3001/supplier/get/:id
router.get("/get/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const supplier = await Supplier.findById(id);
        if (supplier) {
            res.status(200).json({ message: "Supplier fetched successfully", supplier });
        } else {
            res.status(404).json({ error: "Supplier not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred while fetching supplier" });
    }
});

module.exports = router;
