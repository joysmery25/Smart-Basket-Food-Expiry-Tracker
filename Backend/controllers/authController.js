const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password hashing handled in model)
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    let { email, name, googleId, photo, tokenId } = req.body;

    if (tokenId) {
        const decoded = jwt.decode(tokenId);
        if (decoded) {
            email = decoded.email;
            name = decoded.name;
            googleId = decoded.sub || decoded.user_id;
            photo = decoded.picture;
        }
    }

    if (!email || !name) {
        return res.status(400).json({ message: 'Missing email or name in request or token' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
        // If user exists, log them in
        // Ideally checking googleId matches, but for simplicity assuming email trust
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        });
    } else {
        // Create new user
        // Generate random password as fallback
        const randomPassword = Math.random().toString(36).slice(-8);

        user = await User.create({
            name,
            email,
            password: randomPassword,
            googleId
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id)
            });
        }
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.apartment = req.body.apartment || user.apartment;
        user.phone = req.body.phone || user.phone;

        if (req.body.settings) {
            user.settings = { ...user.settings, ...req.body.settings };
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            apartment: updatedUser.apartment,
            phone: updatedUser.phone,
            settings: updatedUser.settings,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Get user analytics
// @route   GET /api/auth/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.stats);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    googleLogin,
    updateProfile,
    getAnalytics
};
