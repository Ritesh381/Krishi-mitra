// controllers/cropController.js
const { cropModels } = require("../models/crop.model.js");
const callModel = require("../config/ai");
const { getLocationWeather } = require("../utils/location");

exports.getCropRecommendations = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // 1️⃣ Get location & weather (handled in utils)
    const { name: locationName, temp, humidity } = await getLocationWeather(
      latitude,
      longitude
    );
    const currentMonth = new Date().getMonth() + 1;

    // 2️⃣ Match local crop models
    const suitableCrops = cropModels.filter((crop) => {
      const tempOK = temp >= crop.tempRange[0] && temp <= crop.tempRange[1];
      const humidityOK =
        humidity >= crop.humidityRange[0] && humidity <= crop.humidityRange[1];
      return tempOK && humidityOK;
    });

    // 3️⃣ AI prompt
    const prompt = `
You are an Indian agricultural expert.
Location: ${locationName}
Temperature: ${temp}°C
Humidity: ${humidity}%
Month: ${currentMonth}

Recommend the top 3 crops that can be planted here this month.
Provide the response ONLY in valid JSON format like this:

[
  {
    "name": "Crop Name",
    "icon": "🌾",
    "profit": "₹/acre",
    "plantingTime": "Month/Date Range",
    "duration": "in days",
    "water": "irrigation info",
    "reason": "why this crop fits current weather"
  }
]
`;

    // 4️⃣ Call Gemini for recommendations
    let crops = [];
    try {
      crops = await callModel(prompt);
    } catch (err) {
      console.warn("Gemini failed, falling back to crop models:", err.message);
    }

    // 5️⃣ Fallback
    if (!crops.length && suitableCrops.length) {
      crops = suitableCrops.map((c) => ({
        name: c.name,
        icon: c.icon,
        profit: c.profit,
        plantingTime: c.plantingTime,
        duration: c.duration,
        water: c.water,
        reason: "Suitable temperature and humidity per local model.",
      }));
    }

    // 6️⃣ Respond
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
