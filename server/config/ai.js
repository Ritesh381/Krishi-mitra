const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY
});

async function callModel(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // Requesting JSON output
      config: {
        responseMimeType: "application/json", 
      },
    });
    
    const responseText = response.text; 
    const responseObject = JSON.parse(responseText); 
    return responseObject; 

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Error parsing JSON from AI response:", error.message); 
      throw new Error("AI response was not valid JSON and could not be parsed.");
    }
    
    console.error("Gemini API Request Failed:", error.message); 
    throw new Error(`Gemini API Request Failed: ${error.message}`);
  }
}

module.exports = callModel;