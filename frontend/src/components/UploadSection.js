// File: frontend/src/components/UploadSection.js

import React, { useRef } from 'react';

// Accept props from the App.js parent
function UploadSection({ onFileSelect, onAnalyzeClick, isLoading, error }) {
  const inputRef = useRef(null);

  // When the user clicks the upload area, trigger the hidden file input
  const handleAreaClick = () => {
    inputRef.current.click();
  };

  // When a file is selected, call the onFileSelect function from App.js
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="upload-section">
      {/* Hidden file input */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,video/*"
      />

      <h3 className="upload-title">Analyze Suspected Media</h3>
      <p>Upload images,video files for deepfake detection</p>

      {/* This div is now a button to open the file dialog */}
      <div className="upload-area" onClick={handleAreaClick}>
        <div className="upload-icon">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <div className="upload-text">
          <p>Drag & drop files here or click to browse</p>
          <p className="card-text">
            Supported formats: JPG, PNG, MP3 (Max 100MB)
          </p>
        </div>
        <button className="btn">Select Files</button>
      </div>

      {/* Show an error message if one exists */}
      {error && (
        <div style={{ color: 'var(--danger)', marginTop: '15px' }}>{error}</div>
      )}

      {/* Show a loading spinner or the "Analyze" button */}
      <div style={{ marginTop: '20px' }}>
        {isLoading ? (
          <div>
            <i className="fas fa-spinner fa-spin"></i> Analyzing... Please wait.
          </div>
        ) : (
          // This button now triggers the handleUpload function in App.js
          <button className="btn" onClick={onAnalyzeClick}>
            Analyze File
          </button>
        )}
      </div>
    </div>
  );
}

export default UploadSection;