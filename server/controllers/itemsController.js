const { db } = require('../database');

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodItem:
 *       type: object
 *       required:
 *         - name
 *         - expiryDate
 *         - quantity
 *         - unit
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the item
 *         name:
 *           type: string
 *           description: Name of the food item
 *         category:
 *           type: string
 *         expiryDate:
 *           type: string
 *           format: date
 *         purchaseDate:
 *           type: string
 *           format: date
 *         storage:
 *           type: string
 *           enum: [fridge, freezer, pantry]
 *         quantity:
 *           type: number
 *         unit:
 *           type: string
 *         urgency:
 *           type: string
 *           enum: [critical, warning, safe]
 */

exports.getItems = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM food_items WHERE user_id = ? ORDER BY expiry_date ASC');
        const items = stmt.all(req.userId).map(item => {
            // Calculate urgency dynamically
            const expiry = new Date(item.expiry_date);
            const today = new Date();
            // Reset time part for accurate day calculation
            expiry.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let urgency = 'safe';
            if (diffDays <= 3) {
                urgency = 'critical';
            } else if (diffDays <= 7) {
                urgency = 'warning';
            }

            return {
                id: item.id.toString(),
                name: item.name,
                category: item.category,
                expiryDate: item.expiry_date,
                purchaseDate: item.purchase_date,
                storage: item.storage,
                quantity: item.quantity,
                unit: item.unit,
                urgency: urgency // Use calculated urgency
            };
        });
        res.status(200).json({ items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addItem = (req, res) => {
    // We still accept urgency from frontend if provided (e.g. user override), 
    // but typically we should calculate it. For now, let's keep accepting it 
    // but we could enforce calculation here too if needed. 
    // The user requirement mainly focused on "changing day by day", which getItems handles.
    const { name, category, expiryDate, purchaseDate, storage, quantity, unit, urgency: providedUrgency } = req.body;

    // Calculate initial urgency to ensure consistency if not provided or to validate
    const expiry = new Date(expiryDate);
    const today = new Date();
    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let calculatedUrgency = 'safe';
    if (diffDays <= 3) {
        calculatedUrgency = 'critical';
    } else if (diffDays <= 7) {
        calculatedUrgency = 'warning';
    }

    const finalUrgency = providedUrgency || calculatedUrgency;

    try {
        const insert = db.prepare(`
            INSERT INTO food_items (user_id, name, category, expiry_date, purchase_date, storage, quantity, unit, urgency)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const info = insert.run(req.userId, name, category, expiryDate, purchaseDate, storage, quantity, unit, finalUrgency);

        const newItem = {
            id: info.lastInsertId.toString(),
            name, category, expiryDate, purchaseDate, storage, quantity, unit,
            urgency: finalUrgency
        };

        res.status(201).json({ message: 'Item added', item: newItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateItem = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const update = db.prepare('UPDATE food_items SET quantity = ? WHERE id = ? AND user_id = ?');
        const info = update.run(quantity, id, req.userId);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }

        res.status(200).json({ message: 'Item updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteItem = (req, res) => {
    const { id } = req.params;
    try {
        const deleteStmt = db.prepare('DELETE FROM food_items WHERE id = ? AND user_id = ?');
        const info = deleteStmt.run(id, req.userId);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }

        res.status(200).json({ message: 'Item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
