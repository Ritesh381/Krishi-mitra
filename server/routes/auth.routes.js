// routes/cropRoutes.js
const express = require("express");
const { signIn, signUp } = require("../controllers/auth.controllers.js");
const { authenticateToken } = require("../middleware/auth.js");
const { getUser } = require("../controllers/User.controllers.js");

const router = express.Router();

// Register route
router.post('/register', signUp);

// Login route
router.post('/login', signIn);

// Protected route example
router.get('/profile', authenticateToken, getUser);

module.exports = router;

