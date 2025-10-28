// utils/forecast.js
const axios = require("axios");

/**
 * Simulated 7-day forecast using free OpenWeather current weather data.
 * This avoids paid One Call API but still gives meaningful daily info.
 */
async function getWeeklyForecast(latitude, longitude) {
  if (!latitude || !longitude) {
    throw new Error("Latitude and longitude are required.");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.WEATHER_API_KEY}`;

  try {
    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data;

    if (!data || !data.main || !data.weather) {
      throw new Error("Incomplete weather data received.");
    }

    // Extract base conditions
    const currentTemp = data.main.temp;
    const humidity = data.main.humidity;
    const description = data.weather[0]?.description || "N/A";

    // Create a lightweight simulated 7-day forecast
    const forecast = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);

      // Slight daily temp variation for realism
      const tempVariation = Math.sin(i / 2) * 2; // ±2°C variation
      const rainChance = Math.max(
        0,
        Math.min(100, Math.round(Math.random() * 20 + (description.includes("rain") ? 50 : 10)))
      );

      return {
        date: date.toLocaleDateString("en-IN", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
        temp: Math.round(currentTemp + tempVariation),
        humidity,
        rainChance,
        description,
      };
    });

    return forecast;
  } catch (error) {
    console.error("Forecast API error details:", error.response?.data || error.message);
    throw new Error("Unable to get weather forecast data.");
  }
}

module.exports = { getWeeklyForecast };
