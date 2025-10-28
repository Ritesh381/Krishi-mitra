const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY
});

async function callModel(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      history:[],
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

async function chatModel(contents) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    return response.text;
  } catch (error) {
    console.error("Error in chatModel:", error);
    throw new Error(`chatModel failed: ${JSON.stringify(error)}`);
  }
}



module.exports = {callModel, chatModel};