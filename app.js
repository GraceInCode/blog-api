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
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080', 'http://localhost:8081'] })); // Allow the front-ends

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
