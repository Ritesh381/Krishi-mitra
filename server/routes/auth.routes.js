// routes/cropRoutes.js
const express = require("express");
const { signIn, signUp, logout } = require("../controllers/auth.controllers.js");
const authenticateToken = require("../middleware/auth.js");
const { getUser } = require("../controllers/User.controllers.js");

const router = express.Router();


router.post('/register', signUp);
router.post('/login', signIn);
router.post("/logout", logout);
router.get('/profile', authenticateToken, getUser);

module.exports = router;

