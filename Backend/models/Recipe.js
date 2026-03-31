const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL
        default: 'https://via.placeholder.com/150'
    },
    ingredients: [{
        type: String,
        required: true
    }],
    steps: [{
        type: String,
        required: true
    }],
    tags: [{
        type: String,
        enum: ['Andhra', 'Veg', 'Non-Veg', 'Budget Friendly', 'Quick', 'Healthy']
    }],
    timeToCook: {
        type: Number, // in minutes
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    }
}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
