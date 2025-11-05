import React, { useState } from "react";

function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { icon: "fa-home", name: "Dashboard" },
  //  { icon: "fa-upload", name: "Upload Media" },
    //{ icon: "fa-history", name: "Analysis History" },
    //{ icon: "fa-chart-bar", name: "Statistics" },
    //{ icon: "fa-cog", name: "Settings" },
    //{ icon: "fa-question-circle", name: "Help & Support" },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <i className="fas fa-shield-alt"></i>
        <h1>Deepfake Detector</h1>
      </div>

      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`menu-item ${active === item.name ? "active" : ""}`}
          onClick={() => setActive(item.name)}
        >
          <i className={`fas ${item.icon}`}></i>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
