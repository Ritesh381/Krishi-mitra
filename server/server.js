const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require("./config/db.js");
const app = express();
const PORT = process.env.PORT || 5000;
const chatRouter = require("./routes/Chat.routers.js")
const authRouter = require('./routes/auth.routes.js');
// const cropRouter = require('./routes/crop.routes.js');

// Middleware
app.use(cors());
app.use(express.json());

connectDB()

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Krishi Mitra API' });
});

app.use('/api/auth', authRouter);
// app.use('/api/crop', cropRouter);

//Routers
app.use("/api/chat", chatRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
