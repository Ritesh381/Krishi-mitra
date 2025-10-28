// routes/cropRoutes.js
const express = require("express");
const { getCropRecommendations } = require("../controllers/crop.controller.js");

const router = express.Router();

router.post("/recommend", getCropRecommendations);

module.exports = router;
