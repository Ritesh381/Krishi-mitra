const User = require("../models/User.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true, 
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signUp = async (req, res) => {
  try {
    const { email, password, name, location, farmSize } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Validate farmSize if provided
    const allowedFarmSizes = ["small", "medium", "large"];
    if (farmSize && !allowedFarmSizes.includes(farmSize)) {
      return res
        .status(400)
        .json({ message: `Invalid farmSize. Allowed values: ${allowedFarmSizes.join(", ")}` });
    }

    // Create user (password will be hashed automatically via schema pre-save)
    const user = new User({ email, password, name, location, farmSize });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response with cookie
    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          location: user.location,
          farmSize: user.farmSize,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, cookieOptions)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
        },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signIn, signUp, logout };
