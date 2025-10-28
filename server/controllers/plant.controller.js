const fs = require("fs");
const {callModel} = require("../config/ai");
const prompts = require("../config/prompts");

/**
 * analyzePlant - Decoupled from Multer specifics
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 *
 * Expects:
 * - req.file.path (from multer) OR
 * - req.body.description
 */
exports.analyzePlant = async (req, res) => {
  try {
    let prompt = prompts.photoAnalyzer;

    if (req.file && req.file.path) {
      // Use image path from multer
      const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });
      prompt += `\n\nHere is the plant photo in base64:\n${imageBase64}`;

      //Add langauge preference of response
      if (req.body.language) {
        prompt += `\n\nPlease respond in ${req.body.language}. and make sure to translate any scientific terms appropriately. also respond with the language sent and not english `;
      }

      // Delete the uploaded image after reading
      fs.unlink(req.file.path, () => {});
    } else if (req.body.description) {
      // Use user text description
      prompt += `\n\nFarmer description: ${req.body.description}`;
    } else {
      return res.status(400).json({ error: "Provide an image or a text description of the plant." });
    }

    // Call Gemini AI using existing ai.js (no changes needed)
    const analysis = await callModel(prompt, "text"); // or "json" if desired

    res.json({ analysis });
  } catch (error) {
    console.error("Plant analysis failed:", error.message);
    res.status(500).json({ error: "Failed to analyze the plant." });
  }
};
