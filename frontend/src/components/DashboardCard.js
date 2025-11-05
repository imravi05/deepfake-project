// File: frontend/src/components/DashboardCard.js

import React from "react";

// Accept 'stats' as a prop from App.js
function DashboardCards({ stats }) {
  // Show a loading state until stats are fetched
  if (!stats) {
    return <div className="dashboard-cards">Loading stats...</div>;
  }

  // Use the real data from the backend
  const cards = [
    {
      title: "Total Analyses",
      icon: "fa-chart-line",
      value: stats.totalAnalyses,
      text: "Total files processed",
    },
    {
      title: "Deepfake Detected",
      icon: "fa-exclamation-triangle",
      value: stats.deepfakeDetected,
      text: "Files identified as fake",
    },
    {
      title: "Accuracy Rate",
      icon: "fa-target",
      value: stats.accuracyRate,
      text: "Based on test data",
    },
    {
      title: "Avg. Processing Time",
      icon: "fa-clock",
      value: stats.avgProcessingTime,
      text: "Per file analysis",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <div className="card-header">
            <div className="card-title">{card.title}</div>
            <div className="card-icon">
              <i className={`fas ${card.icon}`}></i>
            </div>
          </div>
          <div className="card-value">{card.value}</div>
          <div className="card-text">{card.text}</div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;