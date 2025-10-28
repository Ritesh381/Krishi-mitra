const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const connectDB = require("./config/db.js");
const { getUser } = require('./controllers/User.controllers.js');
const { signIn, signUp } = require('./controllers/auth.controllers.js');
const {authenticateToken} = require("./middleware/auth.js")
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectDB()

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Krishi Mitra API' });
});

// Register route
app.post('/api/auth/register', signUp);

// Login route
app.post('/api/auth/login', signIn);

// Protected route example
app.get('/api/auth/profile', authenticateToken, getUser);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
