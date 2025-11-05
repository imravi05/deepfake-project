// File: backend-node/config/gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a non-technical report using the Gemini API.
 * @param {string} prediction - The model's prediction ("real" or "fake").
 * @param {number} confidence - The model's confidence score (e.g., 0.92).
 * @returns {Promise<string>} - The AI-generated report.
 */
async function generateGeminiReport(prediction, confidence) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Craft a specific prompt for our non-technical user
    const confidencePercent = Math.round(confidence * 100);
    const prompt = `
      You are an AI assistant explaining a cybersecurity analysis to a non-technical manager.
      My deepfake detection model analyzed a file and its verdict is:

      - Prediction: ${prediction}
      - Confidence: ${confidencePercent}%

      Please write a simple, one-paragraph report (about 3-4 sentences) that explains what this means in plain English.
      If it's 'fake', briefly mention the risks.
      If it's 'real', briefly state that the media appears authentic.
      Do not use technical jargon.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Error generating Gemini report:", error);
    // Fallback to a simple message if the API fails
    return "Failed to generate AI report. Please check the model's prediction and confidence score.";
  }
}

module.exports = { generateGeminiReport };