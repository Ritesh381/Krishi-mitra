// utils/location.js
const axios = require("axios");

/**
 * Fetch weather information for given coordinates
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{ name: string, temp: number, humidity: number }>}
 */
async function getLocationWeather(latitude, longitude) {
  if (
    latitude === undefined ||
    longitude === undefined ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    throw new Error("Valid latitude and longitude are required.");
  }

  try {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

    const response = await axios.get(weatherURL, { timeout: 5000 });
    const data = response.data;

    return {
      name: data.name || "Unknown location",
      temp: data.main.temp,
      humidity: data.main.humidity,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error.message);
    throw new Error("Failed to retrieve weather data.");
  }
}

module.exports = { getLocationWeather };
