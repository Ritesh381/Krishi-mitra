// models/crop.model.js
exports.cropModels = [
  {
    name: "Wheat (गेहूं)",
    icon: "🌾",
    tempRange: [10, 25],
    humidityRange: [30, 70],
    profit: "₹40,000–50,000/acre",
    plantingTime: "Nov 1–15",
    duration: "120–150 days",
    water: "4–5 irrigations",
  },
  {
    name: "Rice (धान)",
    icon: "🌾",
    tempRange: [20, 35],
    humidityRange: [60, 90],
    profit: "₹50,000–60,000/acre",
    plantingTime: "Jun 15–Jul 15",
    duration: "120 days",
    water: "Requires standing water",
  },
  {
    name: "Maize (मक्का)",
    icon: "🌽",
    tempRange: [18, 30],
    humidityRange: [40, 80],
    profit: "₹30,000–45,000/acre",
    plantingTime: "Jun–Jul or Feb–Mar",
    duration: "90–110 days",
    water: "Moderate irrigation",
  },
];
