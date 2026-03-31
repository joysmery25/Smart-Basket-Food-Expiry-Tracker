const mongoose = require('mongoose');

const sharedFoodSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    foodName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    pickupLocation: {
        type: String, // e.g., Apartment Block
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Requested', 'Claimed'],
        default: 'Available'
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

const SharedFood = mongoose.model('SharedFood', sharedFoodSchema);

module.exports = SharedFood;
