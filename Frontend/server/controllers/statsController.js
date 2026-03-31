const { db } = require('../database');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserStats:
 *       type: object
 *       properties:
 *         foodSaved:
 *           type: number
 *         co2Saved:
 *           type: number
 *         currentStreak:
 *           type: integer
 *         recipesCooked:
 *           type: integer
 */

exports.getStats = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM user_stats WHERE user_id = ?');
        let stats = stmt.get(req.userId);

        if (!stats) {
            // Initialize if not exists
            const insert = db.prepare('INSERT INTO user_stats (user_id) VALUES (?)');
            insert.run(req.userId);
            stats = { food_saved: 0, co2_saved: 0, current_streak: 0, recipes_cooked: 0 };
        }

        res.status(200).json({
            foodSaved: stats.food_saved || 0,
            co2Saved: stats.co2_saved || 0,
            currentStreak: stats.current_streak || 0,
            recipesCooked: stats.recipes_cooked || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStats = (req, res) => {
    console.log(`[Stats] Updating for UserID: ${req.userId}`);
    const { foodSaved, recipesCooked } = req.body;

    try {
        // Explicit Check-And-Update Logic
        const check = db.prepare('SELECT * FROM user_stats WHERE user_id = ?');
        const existing = check.get(req.userId);

        if (existing) {
            const update = db.prepare(`
                UPDATE user_stats SET 
                food_saved = food_saved + ?,
                co2_saved = co2_saved + ?,
                recipes_cooked = recipes_cooked + ?,
                last_activity_date = CURRENT_DATE
                WHERE user_id = ?
            `);
            update.run(foodSaved || 0, (foodSaved || 0) * 2.5, recipesCooked || 0, req.userId);
        } else {
            const insert = db.prepare(`
                INSERT INTO user_stats (user_id, food_saved, co2_saved, recipes_cooked, last_activity_date)
                VALUES (?, ?, ?, ?, CURRENT_DATE)
            `);
            insert.run(req.userId, foodSaved || 0, (foodSaved || 0) * 2.5, recipesCooked || 0);
        }

        console.log("Stats updated for UserID:", req.userId);

        const stmt = db.prepare('SELECT * FROM user_stats WHERE user_id = ?');
        const stats = stmt.get(req.userId);

        res.status(200).json({
            foodSaved: stats.food_saved,
            co2Saved: stats.co2_saved,
            currentStreak: stats.current_streak,
            recipesCooked: stats.recipes_cooked
        });
    } catch (err) {
        console.error("Stats Update Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
