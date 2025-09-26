const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

const router = express.Router();

// Register a new user
router.post('/register',[
        body('username').trim().notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const body = req.body || {};
        const { username, password, email } = body;
    try {
        // Basic validation 
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existing = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] }
        });
        if (existing) return res.status(400).json({ error: 'Username or email already taken' });
       
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, role: 'user' }
        });

        res.status(201).json({ message: 'User registered', userId: user.id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login and issue JWT
router.post('/login', [
    body('username').trim().notEmpty(),
    body('password').isLength({ min: 6 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || 'Login failed' });

        // Generate JWT
        const payload = { id: user.id, username: user.username, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    })(req, res, next);
});

module.exports = router;