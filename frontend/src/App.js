// File: frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import all your components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardCards from './components/DashboardCard';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultSection';
import HistorySection from './components/HistorySection';

// Set the base URL for our Node.js backend
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  // --- State Management ---
  // This is where we hold all the data for the app
  const [file, setFile] = useState(null); // The currently selected file
  const [isLoading, setIsLoading] = useState(false); // For loading spinners
  const [analysis, setAnalysis] = useState(null); // The final report
  const [history, setHistory] = useState([]); // The list for the history table
  const [error, setError] = useState(null); // For error messages

  // --- API Functions ---

  // 1. Fetch all history from the backend when the app loads
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/submissions/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // 2. Poll the backend for the status of a single submission
  const pollForStatus = async (submissionId) => {
    try {
      const res = await axios.get(`/api/submissions/status/${submissionId}`);
      
      if (res.data.status === 'processing') {
        // If still processing, wait 3 seconds and check again
        setTimeout(() => pollForStatus(submissionId), 3000);
      } else {
        // Processing is done!
        setIsLoading(false);
        setAnalysis(res.data); // Set the final report
        fetchHistory(); // Refresh the history table
      }
    } catch (err) {
      setIsLoading(false);
      setError('Failed to fetch analysis status.');
      console.error(err);
    }
  };

  // 3. Handle the main file upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null); // Clear previous results

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the file to the backend
      const res = await axios.post('/api/submissions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Backend returns the new submission ID. Start polling for the result.
      pollForStatus(res.data.submissionId);

    } catch (err) {
      setIsLoading(false);
      setError('File upload failed. Please try again.');
      console.error(err);
    }
  };

  // --- Initial Load ---
  // This useEffect hook runs once when the app first loads
  useEffect(() => {
    fetchHistory();
  }, []); // The empty array means "run only once"

  // --- Render the App ---
  // We pass the state and functions down to your components as props
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <DashboardCards />
        <UploadSection 
          onFileSelect={setFile} 
          onAnalyzeClick={handleUpload} 
          isLoading={isLoading} 
          error={error}
        />
        <ResultsSection analysis={analysis} />
        <HistorySection history={history} />
      </div>
    </div>
  );
}

export default App;