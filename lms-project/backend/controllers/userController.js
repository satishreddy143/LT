const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User authentication
module.exports = (db) => ({
  // Create a new user
  createUser: async (req, res) => {
      try {
          const { username, email, password, role } = req.body;

          // Check if user exists
          const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
          if (existingUser.length > 0) {
              return res.status(400).json({ message: 'User already exists' });
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
          const [result] = await db.promise().query(query, [username, email, hashedPassword, role]);

          return res.status(201).json({
              success: true,
              data: { id: result.insertId, username, email },
          });
      } catch (error) {
          console.error('Error creating user:', error);
          return res.status(500).json({
              success: false,
              message: 'Server error',
          });
      }
  },

  // Get all users
  getUsers: async (req, res) => {
      try {
          const query = 'SELECT * FROM users';
          const [rows] = await db.promise().query(query);

          return res.status(200).json({
              success: true,
              data: rows,
          });
      } catch (error) {
          console.error('Error fetching users:', error);
          return res.status(500).json({
              success: false,
              message: 'Server error',
          });
      }
  },

  // Login user and return JWT token
  loginUser: async (req, res) => {
      const { email, password } = req.body;

      const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      if (user.length === 0) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  }
});
