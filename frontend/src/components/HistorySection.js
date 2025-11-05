// File: frontend/src/components/HistorySection.js

import React from "react";

// Accept 'history' as a prop from App.js
function HistorySection({ history }) {
  return (
    <div className="history-section">
      <h3 className="section-title">Recent Analysis History</h3>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>File Name</th>
            <th>Type</th>
            <th>Result</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {/* Check if history is empty */}
          {history.length === 0 ? (
            <tr>
              <td colSpan="5">No analysis history found.</td>
            </tr>
          ) : (
            // Map over the 'history' prop
            history.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>{item.fileName}</td>
                <td>{item.fileType}</td>
                <td>
                  <span
                    className={`status-badge ${
                      item.prediction === "real" ? "real" : "fake"
                    }`}
                  >
                    {item.prediction}
                  </span>
                </td>
                <td>{Math.round(item.confidence * 100)}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HistorySection;