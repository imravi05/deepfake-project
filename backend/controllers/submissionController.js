// File: backend/controllers/submissionController.js

// FIX 1: Import the MODEL from '/models/', not the route from '/routes/'
const Submission = require('../models/Submission');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { generateGeminiReport } = require('../config/gemini');

// --- Helper Function: Asynchronous Processing ---
async function processFile(submission) {
  try {
    // --- Part A: Call Python ML API ---
    console.log(`[${submission._id}] Sending to Python API...`);
    
    const form = new FormData();
    // Ensure file exists before reading
    if (!fs.existsSync(submission.filePath)) {
       throw new Error(`File not found at path: ${submission.filePath}`);
    }
    form.append('file', fs.createReadStream(submission.filePath));

    // Send to Python server with correct headers for form-data
    const mlResponse = await axios.post(
      `${process.env.PYTHON_API_URL}/predict`,
      form,
      { headers: form.getHeaders() } 
    );

    const { prediction, confidence, artifacts_detected } = mlResponse.data;

    // Update submission with ML results
    submission.prediction = prediction;
    submission.confidence = confidence;
    submission.modelArtifacts = artifacts_detected;
    await submission.save();
    console.log(`[${submission._id}] Received from Python: ${prediction}`);


    // --- Part B: Call REAL Gemini API ---
    console.log(`[${submission._id}] Generating Gemini report...`);

    // Pass artifacts to Gemini for a detailed report
    const geminiReport = await generateGeminiReport(
      submission.prediction, 
      submission.confidence,
      submission.modelArtifacts 
    );

    // Update submission with the final report and 'completed' status
    submission.geminiReport = geminiReport;
    submission.status = 'completed';
    await submission.save();
    console.log(`[${submission._id}] Process complete.`);

  } catch (error) {
    // --- Error Handling (This was missing in your snippet) ---
    console.error(`[${submission._id}] Error during processing:`, error.message);
    
    // Update DB to show failure so the frontend stops polling
    submission.status = 'failed';
    submission.geminiReport = 'Analysis failed. Please try again.';
    await submission.save();
  }
}

// --- Controller Functions (Exported) ---

/**
 * @route   POST /api/submissions/upload
 * @desc    Upload a file, create DB entry, and start async processing
 */
exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }

  try {
    // Determine file type based on mimetype
    let fileType = 'image';
    if (req.file.mimetype.startsWith('video')) fileType = 'video';
    if (req.file.mimetype.startsWith('audio')) fileType = 'audio';
    
    // Create new Submission document
    const newSubmission = new Submission({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: fileType,
    });

    await newSubmission.save();
    console.log(`[${newSubmission._id}] New submission created for ${newSubmission.fileName}`);

    // Start processing in the background (no 'await' here so response is fast)
    processFile(newSubmission);

    // Send immediate response to frontend
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
 * @route   GET /api/submissions/status/:id
 * @desc    Get the status and data for a single submission
 */
exports.getSubmissionStatus = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
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
 * @route   GET /api/submissions/history
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