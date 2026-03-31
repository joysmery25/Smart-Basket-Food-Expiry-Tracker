const { db } = require('../database');

exports.getProfile = (req, res) => {
    try {
        console.log("Fetching profile for UserID:", req.userId);
        const stmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
        const user = stmt.get(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = (req, res) => {
    const { name, email } = req.body;
    try {
        const update = db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?');
        update.run(name, email, req.userId);

        const stmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
        const user = stmt.get(req.userId);

        res.status(200).json({
            message: 'Profile updated successfully',
            user
        });
    } catch (err) {
        console.error(err);
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLoginHistory = (req, res) => {
    const limit = req.query.limit || 10;
    try {
        const stmt = db.prepare('SELECT ip, user_agent, success, method, timestamp FROM login_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?');
        const history = stmt.all(req.userId, limit);
        res.status(200).json({ history });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
