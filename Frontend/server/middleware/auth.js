const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-it-in-env';

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token; // Fallback to cookie
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        console.log("Decoded Token:", decoded);
        req.userId = decoded.id;
        console.log(`[Auth] Verified UserID: ${req.userId} (Type: ${typeof req.userId})`);
        next();
    });
};

module.exports = {
    verifyToken,
    JWT_SECRET
};
