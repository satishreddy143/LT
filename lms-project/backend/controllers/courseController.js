const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Setup multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Course CRUD operations
module.exports = (db) => ({
  // Create a new course
  createCourse: async (req, res) => {
      const { title, description, category, level, instructorId } = req.body;
      const courseMaterials = req.files.map(file => file.path);

      try {
          const query = 'INSERT INTO courses (title, description, category, level, instructorId, materials) VALUES (?, ?, ?, ?, ?, ?)';
          const [result] = await db.promise().query(query, [title, description, category, level, instructorId, JSON.stringify(courseMaterials)]);

          res.status(201).json({
              success: true,
              course: { id: result.insertId, title, description, category, level, instructorId },
          });
      } catch (error) {
          console.error('Error creating course:', error);
          res.status(500).json({ message: 'Server error' });
      }
  },

  // Get courses with sorting/filtering
  getCourses: async (req, res) => {
      const { category, level, instructorId, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let query = 'SELECT * FROM courses';
      let conditions = [];
      let values = [];

      if (category) {
          conditions.push('category = ?');
          values.push(category);
      }
      if (level) {
          conditions.push('level = ?');
          values.push(level);
      }
      if (instructorId) {
          conditions.push('instructorId = ?');
          values.push(instructorId);
      }

      if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' LIMIT ? OFFSET ?';
      values.push(limit, offset);

      try {
          const [courses] = await db.promise().query(query, values);
          res.status(200).json(courses);
      } catch (error) {
          console.error('Error fetching courses:', error);
          res.status(500).json({ message: 'Server error' });
      }
  },

  upload
});
