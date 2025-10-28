const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require("./config/db.js");
const app = express();
const PORT = process.env.PORT || 8080; // Changed to 8080

const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth.routes.js');
const cropRouter = require('./routes/crop.routes.js');
const plantRouter = require('./routes/plant.routes.js');
const chatRouter = require("./routes/Chat.routes.js")
const weatherRoutes = require("./routes/weather.routes.js");

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', "https://krishi-mitra-two-rho.vercel.app"], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

connectDB()

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Krishi Mitra API - Plant Analysis Ready!' });
});

//Routers
app.use('/api/auth', authRouter);
app.use('/api/crop', cropRouter);
app.use('/api/plant', plantRouter);
app.use("/api/chat", chatRouter)
app.use("/api/weather", weatherRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Plant analysis endpoint: http://localhost:${PORT}/api/plant/analyze`);
});
