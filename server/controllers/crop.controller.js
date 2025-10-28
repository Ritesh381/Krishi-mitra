// controllers/cropController.js
const { cropModels } = require("../models/crop.model.js");
const callModel = require("../config/ai");
const { getLocationWeather } = require("../utils/location");
const prompts = require("../config/prompts.js"); // 👈 Import Krishi Mitra persona

exports.getCropRecommendations = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // 🧭 1️⃣ Validate inputs
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    // 🌤️ 2️⃣ Get location & weather (handled in utils)
    const { name: locationName, temp, humidity } = await getLocationWeather(
      latitude,
      longitude
    );
    const currentMonth = new Date().getMonth() + 1;

    // 🌾 3️⃣ Match local crop models for quick fallback
    const suitableCrops = cropModels.filter((crop) => {
      const tempOK = temp >= crop.tempRange[0] && temp <= crop.tempRange[1];
      const humidityOK =
        humidity >= crop.humidityRange[0] && humidity <= crop.humidityRange[1];
      return tempOK && humidityOK;
    });

    // 💬 4️⃣ Build AI prompt with Krishi Mitra persona
    const prompt = `
${prompts.chatInit}

Now, as Krishi Mitra, use this weather information to recommend crops to the farmer.

Location: ${locationName}
Temperature: ${temp}°C
Humidity: ${humidity}%
Month: ${currentMonth}

Recommend the top 3 crops that the farmer should plant this month.

Your answer must be in **valid JSON only**, using this format:

[
  {
    "name": "Crop Name (in simple words, can include local name)",
    "icon": "🌾",
    "profit": "₹/acre or simple estimate",
    "plantingTime": "Month/Date Range",
    "duration": "Days to harvest",
    "water": "Simple irrigation info",
    "reason": "Why it suits this weather (simple and clear)"
  }
]

Make it specific to ${locationName}, India.
`;

    // 🤖 5️⃣ Call Gemini for recommendations
    let crops = [];
    try {
      crops = await callModel(prompt);
    } catch (err) {
      console.warn("Gemini failed, falling back to local model:", err.message);
    }

    // 🪴 6️⃣ Fallback if AI fails
    if (!crops.length && suitableCrops.length) {
      crops = suitableCrops.map((c) => ({
        name: c.name,
        icon: c.icon,
        profit: c.profit,
        plantingTime: c.plantingTime,
        duration: c.duration,
        water: c.water,
        reason: "Good match for current weather based on local data.",
      }));
    }

    // 🌍 7️⃣ Respond to frontend
    res.json({
      location: locationName,
      temperature: temp,
      humidity,
      crops,
    });
  } catch (error) {
    console.error("Error in crop recommendation:", error.message);
    res.status(500).json({ error: "Failed to get crop recommendations." });
  }
};
