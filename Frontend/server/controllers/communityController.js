const { db } = require('../database');

/**
 * @swagger
 * components:
 *   schemas:
 *     CommunityPost:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         itemName:
 *           type: string
 *         quantity:
 *           type: string
 *         expiryDate:
 *           type: string
 *         note:
 *           type: string
 *         building:
 *           type: string
 *         postedBy:
 *           type: string
 *         postedAt:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, claimed]
 */

exports.getPosts = (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT cp.*, u.name as poster_name 
            FROM community_posts cp 
            JOIN users u ON cp.user_id = u.id 
            ORDER BY cp.created_at DESC
        `);
        const posts = stmt.all().map(post => ({
            id: post.id.toString(),
            itemName: post.item_name,
            quantity: post.quantity,
            expiryDate: post.expiry_date,
            note: post.note,
            building: post.building,
            postedBy: post.user_id === req.userId ? 'You' : post.poster_name,
            postedAt: (() => {
                const posted = new Date(post.created_at);
                const now = new Date();
                const diffMs = now - posted;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);
                const diffDays = Math.floor(diffHours / 24);

                if (diffMins < 1) return 'Just now';
                if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
                if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                if (diffHours < 48) return 'Yesterday';
                return `${diffDays} days ago`;
            })(),
            status: post.status,
            isOwner: post.user_id === req.userId
        }));
        res.status(200).json({ posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createPost = (req, res) => {
    const { itemName, quantity, expiryDate, note, building } = req.body;
    try {
        const insert = db.prepare(`
            INSERT INTO community_posts (user_id, item_name, quantity, expiry_date, note, building)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const info = insert.run(req.userId, itemName, quantity, expiryDate, note, building);

        const newPost = {
            id: info.lastInsertId.toString(),
            itemName, quantity, expiryDate, note, building,
            postedBy: 'You',
            postedAt: 'Just now',
            status: 'pending'
        };

        res.status(201).json({ message: 'Post created', post: newPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePostStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted', 'rejected'

    try {
        // Only the owner can accept/reject
        const update = db.prepare('UPDATE community_posts SET status = ? WHERE id = ? AND user_id = ?');
        const info = update.run(status, id, req.userId);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }

        res.status(200).json({ message: `Request ${status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
