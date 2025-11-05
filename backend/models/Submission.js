// File: backend/models/Submission.js

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'video', 'audio'] },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  prediction: {
    type: String,
    enum: ['real', 'fake', 'unknown'],
    default: 'unknown'
  },
  confidence: { type: Number, default: 0 },
  modelArtifacts: [String],
  geminiReport: { type: String, default: 'Report generation pending...' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);