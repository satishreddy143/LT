const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Add new course (only admin or instructor)
router.post('/add', async (req, res) => {
    const { title, description, category, level } = req.body;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin' && decoded.role !== 'instructor') {
            return res.status(403).json({ message: "Permission denied" });
        }

        const result = await db.query(
            'INSERT INTO courses (title, description, category, level, instructor_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, category, level, decoded.id]
        );

        res.json({ success: true, message: 'Course added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding course" });
    }
});

// View all courses
router.get('/', async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses');
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching courses" });
    }
});

module.exports = router;
