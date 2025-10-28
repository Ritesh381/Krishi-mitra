const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    // Check if token exists in cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user; 
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = authenticateToken;
