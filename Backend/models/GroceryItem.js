const mongoose = require('mongoose');

const groceryItemSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Veg', 'Non-Veg', 'Dairy', 'Fruits', 'Snacks', 'Other']
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: String, // e.g., '1 kg', '2 packets'
        required: true
    },
    storageType: {
        type: String,
        enum: ['Fridge', 'Freezer', 'Pantry'],
        default: 'Pantry'
    },
    isConsumed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);

module.exports = GroceryItem;
