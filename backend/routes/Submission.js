// File: backend-node/routes/submissions.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
//const submissionController = require('../controllers/submissionController');
 const submissionController = require('../controllers/submissionController');

// --- Multer File Storage Configuration ---
// We define this here because it's only used for the upload route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // We use path.join to create a correct path from the root
    cb(null, path.join(__dirname, '..', 'uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });


// --- Define API Routes ---

// @route   POST /api/submissions/upload
// Note: The full path will be /api/submissions/upload
router.post('/upload', upload.single('file'), submissionController.uploadFile);

// @route   GET /api/submissions/status/:id
router.get('/status/:id', submissionController.getSubmissionStatus);

// @route   GET /api/submissions/history
router.get('/history', submissionController.getAllSubmissions);


module.exports = router;