const { getLocationWeather } = require("../utils/location");
const { getWeeklyForecast } = require("../utils/forecast");

// Fetch current weather
exports.getCurrentWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const weather = await getLocationWeather(latitude, longitude);
    res.json({ success: true, weather });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch 7-day forecast
exports.getWeeklyForecast = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const forecast = await getWeeklyForecast(latitude, longitude);
    res.json({ success: true, forecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
