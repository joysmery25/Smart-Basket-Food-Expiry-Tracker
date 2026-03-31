const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () { return !this.googleId; } // Password not required if using Google Login
    },
    googleId: {
        type: String
    },
    apartment: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    settings: {
        darkMode: { type: Boolean, default: false },
        budgetFriendly: { type: Boolean, default: false },
        familySize: { type: Number, default: 1 }
    },
    stats: {
        foodSavedKg: { type: Number, default: 0 },
        recipesCooked: { type: Number, default: 0 },
        streakDays: { type: Number, default: 0 },
        co2Saved: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
