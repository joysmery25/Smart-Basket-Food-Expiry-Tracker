const SharedFood = require('../models/SharedFood');

// @desc    Post food for sharing
// @route   POST /api/community/share
// @access  Private
const shareFood = async (req, res) => {
    const { foodName, quantity, expiryDate, pickupLocation } = req.body;

    const food = await SharedFood.create({
        postedBy: req.user.id,
        foodName,
        quantity,
        expiryDate,
        pickupLocation
    });

    const populatedFood = await SharedFood.findById(food._id).populate('postedBy', 'name apartment');

    // Real-time: Emit event to all clients
    req.io.emit('new-food-posted', populatedFood);

    res.status(201).json(populatedFood);
};

// @desc    Get all available shared food
// @route   GET /api/community/food
// @access  Private
const getSharedFood = async (req, res) => {
    const foods = await SharedFood.find({ status: { $ne: 'Claimed' } })
        .populate('postedBy', 'name apartment')
        .sort({ createdAt: -1 });
    res.json(foods);
};

// @desc    Request food
// @route   PUT /api/community/food/:id/request
// @access  Private
const requestFood = async (req, res) => {
    const food = await SharedFood.findById(req.params.id);

    if (!food) {
        return res.status(404).json({ message: 'Food not found' });
    }

    if (food.status !== 'Available') {
        return res.status(400).json({ message: 'Food is not available' });
    }

    if (food.postedBy.toString() === req.user.id) {
        return res.status(400).json({ message: 'You cannot request your own food' });
    }

    food.status = 'Requested';
    food.requestedBy = req.user.id;
    await food.save();

    // Notify the poster
    req.io.to(food.postedBy.toString()).emit('food-requested', {
        foodId: food._id,
        foodName: food.foodName,
        requestedBy: req.user.name
    });

    res.json(food);
};

// @desc    Approve/Reject request (by poster)
// @route   PUT /api/community/food/:id/status
// @access  Private
const updateFoodStatus = async (req, res) => {
    const { status } = req.body; // 'Claimed' (Accept) or 'Available' (Reject)
    const food = await SharedFood.findById(req.params.id);

    if (!food) {
        return res.status(404).json({ message: 'Food not found' });
    }

    if (food.postedBy.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    food.status = status;
    if (status === 'Available') {
        food.requestedBy = null; // Reset request
    }

    await food.save();

    // Notify the requester if they exist
    if (food.requestedBy) {
        // In a real app we'd map user IDs to socket IDs, 
        // for now broadcasting specific event that client filters
        req.io.emit('request-status-updated', {
            foodId: food._id,
            status: status,
            requestedBy: food.requestedBy
        });
    }

    res.json(food);
};

module.exports = {
    shareFood,
    getSharedFood,
    requestFood,
    updateFoodStatus
};
