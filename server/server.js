const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const connectDB = require("./config/db.js");
const app = express();
const PORT = process.env.PORT || 5000;

//import routes
const authRouter = require('./routes/auth.routes.js');
const cropRouter = require('./routes/crop.routes.js');

// Middleware
app.use(cors());
app.use(express.json());

connectDB()

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Krishi Mitra API' });
});

app.use('/api/auth', authRouter);
app.use('/api/crop', cropRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
