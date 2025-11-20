// File: backend/config/gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a professional cybersecurity report using the Gemini 2.5 Flash-Lite model.
 * @param {string} prediction - "real" or "fake"
 * @param {number} confidence - 0.0 to 1.0
 * @param {Array<string>} artifacts - List of technical details from the ML model
 */
async function generateGeminiReport(prediction, confidence, artifacts) {
  try {
    // --- FIX: Use "gemini-2.5-flash-lite" (Stable & Fast) ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const confidencePercent = Math.round(confidence * 100);
    
    // Format the artifacts into a readable list
    const artifactList = artifacts && artifacts.length > 0
      ? artifacts.map(item => `- ${item}`).join('\n')
      : "- No specific technical artifacts reported.";

    const prompt = `
      You are a Senior Cybersecurity Analyst. Write a formal analysis report for a client regarding a media file they submitted for Deepfake Detection.

      **Analysis Data:**
      - **Verdict:** ${prediction.toUpperCase()}
      - **Confidence Score:** ${confidencePercent}%
      - **Technical Indicators:**
      ${artifactList}

      **Instructions:**
      Please write a concise, 3-part report. Do not use markdown headers like "##", just use bold text for labels.

      1. **Executive Summary:** Explain clearly whether the file is considered authentic or manipulated.
      2. **Technical Analysis:** Briefly explain the "Technical Indicators" listed above in simple terms. If the confidence is high, explain that strong evidence was found. If low (or inverted), mention the ambiguity.
      3. **Security Recommendation:** Tell the user what to do next. (e.g., "Verify source manually", "Discard immediately", "Safe to use").

      Tone: Professional, Objective, and Cautious.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Error generating Gemini report:", error);
    // Fallback message if API fails
    return `Analysis Complete. Verdict: ${prediction.toUpperCase()} (${Math.round(confidence * 100)}%). (AI Report Unavailable).`;
  }
}

module.exports = { generateGeminiReport };