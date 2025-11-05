// File: backend/controllers/statsController.js

const Submission = require('../models/Submission');

exports.getStats = async (req, res) => {
  try {
    const totalAnalyses = await Submission.countDocuments();
    const deepfakeDetected = await Submission.countDocuments({ prediction: 'fake' });
    
    // For "Accuracy Rate", we'll use a placeholder.
    // A real accuracy rate would require a separate "ground truth" dataset.
    const accuracyRate = "94.7%"; // Placeholder
    
    // For "Avg. Processing Time", we'll use a placeholder.
    // A real calculation would require storing processing time in the schema.
    const avgProcessingTime = "3.2s"; // Placeholder

    res.json({
      totalAnalyses,
      deepfakeDetected,
      accuracyRate,
      avgProcessingTime
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};