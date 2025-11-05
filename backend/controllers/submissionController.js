// File: backend-node/controllers/submissionController.js

const Submission = require('../routes/Submission');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { generateGeminiReport } = require('../config/gemini'); 

// --- Helper Function: Asynchronous Processing ---
// This is the same function from our old index.js
async function processFile(submission) {
  try {
    // --- Part A: Call Python ML API ---
    console.log(`[${submission._id}] Sending to Python API...`);
    const form = new FormData();
    form.append('file', fs.createReadStream(submission.filePath));
    
    const mlResponse = await axios.post(
      `${process.env.PYTHON_API_URL}/predict`,
      form,
      { headers: form.getHeaders() }
    );

    const { prediction, confidence, artifacts_detected } = mlResponse.data;
    
    submission.prediction = prediction;
    submission.confidence = confidence;
    submission.modelArtifacts = artifacts_detected;
    await submission.save();
    console.log(`[${submission._id}] Received from Python: ${prediction}`);

    // --- Part B: (Mock) Call Gemini API ---
    // ... (inside the processFile function, after Part A)

// --- Part B: Call REAL Gemini API ---
console.log(`[${submission._id}] Generating Gemini report...`);

// Call our new service with the REAL data from the Python model
const geminiReport = await generateGeminiReport(
  submission.prediction, 
  submission.confidence
);

// Update submission with the final report and 'completed' status
submission.geminiReport = geminiReport;
submission.status = 'completed';
await submission.save();
console.log(`[${submission._id}] Process complete.`);

// ... (the catch (error) block remains the same)

  } catch (error) {
    console.error(`[${submission._id}] Error during processing:`, error.message);
    submission.status = 'failed';
    submission.geminiReport = 'Analysis failed. Please try again.';
    await submission.save();
  }
}

// --- Controller Functions (Exported) ---

/**
 * @route   POST /api/upload
 * @desc    Upload a file, create DB entry, and start async processing
 */
exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }

  try {
    const newSubmission = new Submission({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype.startsWith('image') ? 'image' : 'video',
    });
    
    await newSubmission.save();
    console.log(`[${newSubmission._id}] New submission created for ${newSubmission.fileName}`);

    // Start processing in the background (no 'await')
    processFile(newSubmission);

    // Send immediate response
    res.status(201).json({ 
      message: 'File uploaded. Processing started.',
      submissionId: newSubmission._id
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @route   GET /api/status/:id
 * @desc    Get the status and data for a single submission
 */
exports.getSubmissionStatus = async (req, res) => {
  try {
    const submission = await submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @route   GET /api/history
 * @desc    Get all past submissions
 */
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};