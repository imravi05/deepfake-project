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
    // A more structured prompt
    const prompt = `
      You are an AI-powered media forensics assistant.
      A file was analyzed with the following results:
      - Prediction: ${prediction.toUpperCase()}
      - Confidence Score: ${confidencePercent}%

      Please generate a report for a non-technical user with the following sections:

      **Analysis Summary:**
      [Explain what the verdict means in one sentence.]

      **Potential Risks:**
      [If 'fake', briefly describe risks like misinformation or fraud. If 'real', state that no manipulation was detected.]

      **Next Steps:**
      [Provide a clear action item. e.g., "This file should be handled with extreme caution." or "This file appears authentic based on our analysis."]
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