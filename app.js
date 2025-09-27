require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { error } = require('console');
const rateLimit = require('express-rate-limit');

const prisma = new PrismaClient();
const app = express();

app.use(express.json()); // For parsing JSON bodies
app.use(cors({ origin: [
    'https://blog-api-bg9g.onrender.com',
    'https://blog-user-qtsx.onrender.com',
    'https://blog-admin-6pb1.onrender.com',
    'https://blog-reader-3w8q.onrender.com'
],
methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicit for safety
allowedHeaders: ['Content-Type', 'Authorization'] // For JWT and JSON
})); 

// Middleware for rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 request
});
app.use(limiter);

// Middleware for logging
app.use(require('morgan')('dev'))


// Passport setup
require('./config/passport')(passport);
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({ message: 'Blog API is running! Use /api/posts, /api/auth, etc.' });
});

// Routes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/auth', require('./routes/auth'));

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
