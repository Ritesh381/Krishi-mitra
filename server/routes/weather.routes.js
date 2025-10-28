const express = require("express");
const router = express.Router();
const { getCurrentWeather, getWeeklyForecast } = require("../controllers/weather.controller.js");

router.post("/current", getCurrentWeather);
router.post("/forecast", getWeeklyForecast);

module.exports = router;
