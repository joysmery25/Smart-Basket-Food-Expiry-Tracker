const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const initCronJobs = require('./jobs/cronJobs');
const { swaggerUi, swaggerSpec } = require('./config/swagger');



// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Init Cron Jobs
initCronJobs();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now (adjust for production)
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { requestSnippetsEnabled: true } }));


// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Basic Route
app.get('/', (req, res) => {
    res.send('SmartBasket API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groceries', require('./routes/groceryRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
