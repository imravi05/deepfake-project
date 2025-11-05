// File: frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardCards from './components/DashboardCard'; // Corrected import name
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultSection';
import HistorySection from './components/HistorySection';

axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null); // <-- ADD STATE FOR STATS

  // 1. Fetch all history from the backend
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/submissions/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // 2. Fetch stats from the backend
  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/stats');
      setStats(res.data); // <-- SET THE STATS
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // 2. Poll the backend
  const pollForStatus = async (submissionId) => {
    try {
      const res = await axios.get(`/api/submissions/status/${submissionId}`);
      
      if (res.data.status === 'processing') {
        setTimeout(() => pollForStatus(submissionId), 3000);
      } else {
        setIsLoading(false);
        setAnalysis(res.data);
        fetchHistory();
        fetchStats(); // <-- REFRESH STATS AFTER ANALYSIS
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
    setAnalysis(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/submissions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      pollForStatus(res.data.submissionId);
    } catch (err) {
      setIsLoading(false);
      setError('File upload failed. Please try again.');
      console.error(err);
    }
  };

  // --- Initial Load ---
  useEffect(() => {
    fetchHistory();
    fetchStats(); // <-- FETCH STATS ON INITIAL LOAD
  }, []);

  // --- Render the App ---
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        {/* Pass stats to the DashboardCards component */}
        <DashboardCards stats={stats} /> 
        <UploadSection
          onFileSelect={setFile}
          onAnalyzeClick={handleUpload}
          isLoading={isLoading}
          error={error}
        />
        <ResultsSection analysis={analysis} />
        {/* Pass history to the HistorySection component */}
        <HistorySection history={history} />
      </div>
    </div>
  );
}

export default App;