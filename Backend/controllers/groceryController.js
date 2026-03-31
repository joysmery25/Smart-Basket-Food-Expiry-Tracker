const GroceryItem = require('../models/GroceryItem');

// @desc    Get all grocery items for logged in user
// @route   GET /api/groceries
// @access  Private
const getGroceries = async (req, res) => {
    const groceries = await GroceryItem.find({ user: req.user.id });

    // Calculate days left for each item (shim logic for frontend)
    const groceriesWithDays = groceries.map(item => {
        const today = new Date();
        const expiry = new Date(item.expiryDate);
        const diffTime = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return {
            ...item._doc,
            daysLeft: diffTime,
            isExpiringSoon: diffTime <= 3 && diffTime >= 0
        };
    });

    res.status(200).json(groceriesWithDays);
};

// @desc    Add new grocery item
// @route   POST /api/groceries
// @access  Private
const addGrocery = async (req, res) => {
    const { itemName, category, expiryDate, quantity, storageType } = req.body;

    if (!itemName || !expiryDate || !quantity) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const grocery = await GroceryItem.create({
        user: req.user.id,
        itemName,
        category,
        expiryDate,
        quantity,
        storageType
    });

    res.status(201).json(grocery);
};

// @desc    Update grocery item
// @route   PUT /api/groceries/:id
// @access  Private
const updateGrocery = async (req, res) => {
    const grocery = await GroceryItem.findById(req.params.id);

    if (!grocery) {
        return res.status(404).json({ message: 'Item not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the grocery user
    if (grocery.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedGrocery = await GroceryItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedGrocery);
};

// @desc    Delete grocery item
// @route   DELETE /api/groceries/:id
// @access  Private
const deleteGrocery = async (req, res) => {
    const grocery = await GroceryItem.findById(req.params.id);

    if (!grocery) {
        return res.status(404).json({ message: 'Item not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the grocery user
    if (grocery.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await grocery.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getGroceries,
    addGrocery,
    updateGrocery,
    deleteGrocery
};
