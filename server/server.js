const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require("./config/db.js");
const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");
const chatRouter = require("./routes/Chat.routes.js")
const authRouter = require('./routes/auth.routes.js');
const cropRouter = require('./routes/crop.routes.js');
const plantRouter = require('./routes/plant.routes.js');

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB()

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Krishi Mitra API' });
});

//Routers
app.use('/api/auth', authRouter);
app.use('/api/crop', cropRouter);
app.use('/api/plant', plantRouter);
app.use("/api/chat", chatRouter)


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
