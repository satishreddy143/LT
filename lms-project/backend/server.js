const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());  // This replaces bodyParser.json()

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// Serve frontend for index
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback route for serving frontend HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
