// File: backend-node/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); // Correct path to db.js

// --- 1. Initializations ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Connect to Database ---
connectDB();

// --- 3. Middleware ---
app.use(cors());
app.use(express.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. Define Routes ---
// All routes starting with /api/submissions will be handled by this file
app.use('/api/submissions', require('./routes/Submission'));

// Root endpoint to check if server is running
app.get('/', (req, res) => {
  res.send('Deepfake Node.js Backend is Running!');
});

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
});