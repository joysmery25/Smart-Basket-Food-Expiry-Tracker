const Recipe = require('../models/Recipe');
const GroceryItem = require('../models/GroceryItem');

// @desc    Get all recipes with filters
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
    const { category, tag, search } = req.query;
    let query = {};

    if (category) {
        // Assuming category maps to Veg/Non-Veg in tags for now or a separate field if added
        query.tags = { $in: [category] };
    }

    if (tag) {
        query.tags = { $in: [tag] };
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
};

// @desc    Get recipes based on user's expiring items
// @route   GET /api/recipes/recommend
// @access  Private
const getRecipeSuggestions = async (req, res) => {
    // 1. Get user's expiring items (e.g., next 5 days)
    const today = new Date();
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(today.getDate() + 5);

    const expiringItems = await GroceryItem.find({
        user: req.user.id,
        expiryDate: { $gte: today, $lte: fiveDaysFromNow },
        isConsumed: false
    });

    if (expiringItems.length === 0) {
        return res.json([]); // No expiring items, no specific recommendation logic yet
    }

    // 2. Extract item names
    const ingredientKeywords = expiringItems.map(item => item.itemName);

    // 3. Find recipes that match ANY of these ingredients
    // This is a simple Regex OR search. For production, use better search indexing.
    const regexConditions = ingredientKeywords.map(keyword => ({
        ingredients: { $regex: keyword, $options: 'i' }
    }));

    const recipes = await Recipe.find({
        $or: regexConditions
    });

    res.json(recipes);
};

// @desc    Seed sample recipes
// @route   POST /api/recipes/seed
// @access  Public (for dev)
const seedRecipes = async (req, res) => {
    const sampleRecipes = [
        {
            name: "Andhra Chicken Curry",
            image: "https://example.com/chicken.jpg",
            ingredients: ["Chicken", "Onion", "Tomato", "Chili Powder", "Ginger Garlic Paste"],
            steps: ["Fry onions", "Add ginger garlic paste", "Add chicken", "Cook until done"],
            tags: ["Non-Veg", "Andhra", "Spicy"],
            timeToCook: 45,
            difficulty: "Medium"
        },
        {
            name: "Vegetable Stir Fry",
            image: "https://example.com/veg.jpg",
            ingredients: ["Carrot", "Beans", "Broccoli", "Soy Sauce", "Garlic"],
            steps: ["Chop veggies", "Stir fry in oil", "Add sauce", "Serve hot"],
            tags: ["Veg", "Healthy", "Quick"],
            timeToCook: 15,
            difficulty: "Easy"
        },
        {
            name: "Tomato Dal",
            image: "https://example.com/dal.jpg",
            ingredients: ["Toor Dal", "Tomato", "Green Chili", "Turmeric"],
            steps: ["Boil dal", "Add tomatoes", "Pressure cook", "Add tempering"],
            tags: ["Veg", "Andhra", "Budget Friendly"],
            timeToCook: 30,
            difficulty: "Easy"
        }
    ];

    await Recipe.deleteMany({});
    await Recipe.insertMany(sampleRecipes);

    res.json({ message: 'Recipes seeded!' });
};

// @desc    Mark recipe as cooked & update stats
// @route   POST /api/recipes/:id/cook
// @access  Private
const markRecipeCooked = async (req, res) => {
    const user = await req.user;

    // Simulate food saved stats
    // In a real app, calculate based on ingredients
    const savedAmount = 0.5; // 0.5 kg
    const co2 = 1.2; // 1.2 kg CO2

    user.stats.recipesCooked += 1;
    user.stats.foodSavedKg += savedAmount;
    user.stats.co2Saved += co2;

    // Simple streak logic (increment if cooked today, logic can be more complex)
    user.stats.streakDays += 1;

    await user.save();

    res.json({
        message: 'Recipe cooked!',
        stats: user.stats
    });
};

module.exports = {
    getRecipes,
    getRecipeSuggestions,
    seedRecipes,
    markRecipeCooked
};
