const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    ItemName: String,
    ItemId: String,
    Quantity: Number,
    MinimumAmount: Number

})

const InventoryModel = mongoose.model("inventory", UserSchema)
module.exports = InventoryModel 