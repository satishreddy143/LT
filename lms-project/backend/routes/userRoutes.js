const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to get user details by ID (authentication check)
router.get('/me', async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to authenticate token" });
    }
});

module.exports = router;
