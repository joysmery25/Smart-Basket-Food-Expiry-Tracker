const express = require('express');
const router = express.Router();
const {
    shareFood,
    getSharedFood,
    requestFood,
    updateFoodStatus
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/community/share:
 *   post:
 *     summary: Share food with the community
 *     tags: [Community]
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
 *     responses:
 *       201:
 *         description: Food shared successfully
 *       401:
 *         description: Not authorized
 */
router.post('/share', protect, shareFood);

/**
 * @swagger
 * /api/community/food:
 *   get:
 *     summary: Get all shared food items
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shared food items
 *       401:
 *         description: Not authorized
 */
router.get('/food', protect, getSharedFood);

/**
 * @swagger
 * /api/community/food/{id}/request:
 *   put:
 *     summary: Request a shared food item
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The food item ID
 *     responses:
 *       200:
 *         description: Food requested successfully
 *       404:
 *         description: Food item not found
 */
router.put('/food/:id/request', protect, requestFood);

/**
 * @swagger
 * /api/community/food/{id}/status:
 *   put:
 *     summary: Update status of a shared food item
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The food item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, requested, claimed]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Food item not found
 */
router.put('/food/:id/status', protect, updateFoodStatus);

module.exports = router;
