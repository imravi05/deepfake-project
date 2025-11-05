import React from "react";

function DashboardCards() {
  const cards = [
    {
      title: "Total Analyses",
      icon: "fa-chart-line",
      value: "1,248",
      text: "+12% from last month",
    },
    {
      title: "Deepfake Detected",
      icon: "fa-exclamation-triangle",
      value: "327",
      text: "26% of total analyses",
    },
    {
      title: "Accuracy Rate",
      icon: "fa-target",
      value: "94.7%",
      text: "Based on test data",
    },
    {
      title: "Avg. Processing Time",
      icon: "fa-clock",
      value: "3.2s",
      text: "Per image analysis",
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
