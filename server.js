const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./swagger.config');

const { initDb } = require('./server/database');
const authController = require('./server/controllers/authController');
const userController = require('./server/controllers/userController');
const itemsController = require('./server/controllers/itemsController');
const communityController = require('./server/controllers/communityController');
const statsController = require('./server/controllers/statsController');
const { verifyToken } = require('./server/middleware/auth');

// Initialize Database
initDb();

const app = express();
const PORT = 5000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'accept']
}));
app.use(express.json());
app.use(cookieParser());

// Swagger Docs
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
// Auth
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/google', authController.googleAuth);
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// User
app.get('/api/auth/me', verifyToken, userController.getProfile);
app.put('/api/auth/profile', verifyToken, userController.updateProfile);
app.get('/api/users/me/logins', verifyToken, userController.getLoginHistory);

// Items
app.get('/api/items', verifyToken, itemsController.getItems);
app.post('/api/items', verifyToken, itemsController.addItem);
app.put('/api/items/:id', verifyToken, itemsController.updateItem);
app.delete('/api/items/:id', verifyToken, itemsController.deleteItem);

// Community
app.get('/api/community', verifyToken, communityController.getPosts);
app.post('/api/community', verifyToken, communityController.createPost);
app.put('/api/community/:id/status', verifyToken, communityController.updatePostStatus);

// Stats
app.get('/api/stats', verifyToken, statsController.getStats);
app.put('/api/stats', verifyToken, statsController.updateStats);

// Admin / Debug
app.get('/api/debug-auth', verifyToken, (req, res) => {
    res.json({
        message: 'You are authenticated',
        userId: req.userId,
        headers: req.headers,
        cookies: req.cookies
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:5000/api-docs`);
});
