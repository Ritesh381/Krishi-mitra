const { cropModels } = require("../models/crop.model.js");
const {callModel} = require("../config/ai");
const { getLocationWeather } = require("../utils/location");
const prompts = require("../config/prompts.js"); // 👈 Import Krishi Mitra persona

exports.getCropRecommendations = async (req, res) => {
  try {
    // 🚜 1️⃣ Extract all detailed inputs from the frontend
    const {
      location,
      farmSize,
      soilType,
      season,
      waterSource,
      budget,
      experience,
      preference,
    } = req.body;

    // 🧭 2️⃣ Validate required input
    if (!location || !soilType || !season) {
      return res
        .status(400)
        .json({ error: "Location, Soil Type, and Season are required for personalized recommendation." });
    } 

    // 🌤️ 3️⃣ Mock or set up basic context. Since the frontend doesn't provide lat/long,
    // we use fixed default values for the prompt context, relying mostly on the form data.
    const locationName = location;
    const temp = 25; // Approx average temperature
    const humidity = 65; // Approx average humidity
    const currentMonth = new Date().getMonth() + 1; // Current month

    // 💬 4️⃣ Build a comprehensive AI prompt with all form details
    const prompt = `
${prompts.chatInit}

As Krishi Mitra, recommend the best crops based on the farmer's detailed inputs below.

**FARMER PROFILE:**
Location: ${locationName} (India)
Soil Type: ${soilType}
Intended Season: ${season}
Farm Size: ${farmSize || 'Not specified'}
Water Source: ${waterSource || 'Not specified (assume moderate irrigation)'}
Budget: ${budget || 'Not specified (assume moderate budget)'}
Farming Experience: ${experience || 'Not specified'}
Crop Preference: ${preference || 'None'}

**CURRENT CONDITIONS (for context):**
Current Month: ${currentMonth}
Approximate Temperature: ${temp}°C
Approximate Humidity: ${humidity}%

**TASK:**
Recommend the top 3 crops that match the farmer's profile, prioritizing profitability, water conservation (if water source is rain-fed), and suitability for the soil/season. Ensure the 'name' is simple/local and the 'profit' and 'water' fields use simple, non-numeric descriptive text (e.g., 'High', 'Medium', 'Drip required').

Your answer must be in **valid JSON only**, using this exact format (return an array of objects):

[
  {
    "name": "Crop Name (in local language/simple words)",
    "icon": "🌾",
    "profit": "Simple, relative profit estimate (e.g., High, Medium, ₹/acre)",
    "plantingTime": "Month/Date Range for the specified season",
    "duration": "Days/Months to harvest",
    "water": "Simple irrigation info (e.g., Low, Drip irrigation recommended)",
    "reason": "Why this crop is best suited for the farmer's specific Soil Type, Season, and Budget/Experience (short, 1-2 sentences)."
  }
]

Do not include any text, greetings, or explanations outside the JSON array.
`;

    // 🤖 5️⃣ Call Gemini for recommendations
    let crops = [];
    try {
      crops = await callModel(prompt);
    } catch (err) {
      console.error("Gemini failed, check JSON parsing or model output:", err.message);
      // NOTE: Fallback to local model removed as it relies on simple weather data which is insufficient for the new detailed inputs.
    }

    // 🌍 6️⃣ Respond to frontend
    res.json({
      location: locationName,
      temperature: temp,
      humidity,
      crops: Array.isArray(crops) ? crops : [], // Ensure crops is an array, even if empty
    });
  } catch (error) {
    console.error("Error in crop recommendation:", error.message);
    res.status(500).json({ error: "Failed to get crop recommendations." });
  }
};
