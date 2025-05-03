const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    supplierName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String, // String is used to handle various phone number formats
        required: true
    },
    address: {
        type: String,
        required: true
    },
    partsRequired: {
        type: String, // Description or list of parts required
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    additionalNote: {
        type: String, // Optional additional notes from the supplier
        default: ""
    }
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
