const express = require('express');
const router = express.Router();
const {
    getRecipes,
    getRecipeSuggestions,
    seedRecipes,
    markRecipeCooked
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recipes
 */
router.get('/', protect, getRecipes);

/**
 * @swagger
 * /api/recipes/recommend:
 *   get:
 *     summary: Get recipe recommendations based on ingredients
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recommended recipes
 *       401:
 *         description: Not authorized
 */
router.get('/recommend', protect, getRecipeSuggestions);

/**
 * @swagger
 * /api/recipes/seed:
 *   post:
 *     summary: Seed the database with sample recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Recipes seeded successfully
 */
router.post('/seed', protect, seedRecipes);

/**
 * @swagger
 * /api/recipes/{id}/cook:
 *   post:
 *     summary: Mark a recipe as cooked and deduct ingredients
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe marked as cooked
 *       400:
 *         description: Not enough ingredients
 *       404:
 *         description: Recipe not found
 */
router.post('/:id/cook', protect, markRecipeCooked);

module.exports = router;
