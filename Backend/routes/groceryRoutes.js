const express = require('express');
const router = express.Router();
const {
    getGroceries,
    addGrocery,
    updateGrocery,
    deleteGrocery
} = require('../controllers/groceryController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/groceries:
 *   get:
 *     summary: Get all grocery items
 *     tags: [Groceries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of grocery items
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Add a new grocery item
 *     tags: [Groceries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grocery item added
 *       401:
 *         description: Not authorized
 */
router.route('/').get(protect, getGroceries).post(protect, addGrocery);

/**
 * @swagger
 * /api/groceries/{id}:
 *   put:
 *     summary: Update a grocery item
 *     tags: [Groceries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The grocery item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grocery item updated
 *       404:
 *         description: Grocery item not found
 *   delete:
 *     summary: Delete a grocery item
 *     tags: [Groceries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The grocery item ID
 *     responses:
 *       200:
 *         description: Grocery item deleted
 *       404:
 *         description: Grocery item not found
 */
router.route('/:id').put(protect, updateGrocery).delete(protect, deleteGrocery);

module.exports = router;
