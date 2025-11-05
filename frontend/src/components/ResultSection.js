// File: frontend/src/components/ResultSection.js

import React from 'react';

// Accept the 'analysis' object as a prop
function ResultsSection({ analysis }) {
  
  // If no analysis has been run, show nothing
  if (!analysis) {
    return null; 
  }

  // We got a result! Display it.
  const confidencePercent = Math.round(analysis.confidence * 100);
  const mediaPath = analysis.filePath.replace(/\\/g, '/');
  const mediaUrl = `http://localhost:5000/${mediaPath}`; // URL to the file on the backend

  return (
    <div className="results-section">
      <h3 className="section-title">Latest Analysis Result</h3>

      <div className="result-content">
        <div className="media-preview">
          {analysis.fileType === 'image' ? (
            <img src={mediaUrl} alt="Analyzed Media" />
          ) : (
            <video src={mediaUrl} controls style={{ width: '100%' }} alt="Analyzed Media" />
          )}
        </div>

        <div className="analysis-result">
          <div className={`result-tag ${analysis.prediction}`}>
            {analysis.prediction.toUpperCase()} - {confidencePercent}% Confidence
          </div>
          
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            {analysis.geminiReport} {/* This is the real report! */}
          </p>

          <div className="confidence-meter">
            <div 
              className="confidence-fill" 
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>

          <h4>Model Analysis Details</h4>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            {analysis.modelArtifacts.map((artifact, index) => (
              <li key={index}>{artifact}</li>
            ))}
          </ul>

          <button className="btn" style={{ marginTop: '15px' }}>
            <i className="fas fa-download"></i> Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsSection;