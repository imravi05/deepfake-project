import React from "react";

function Header() {
  return (
    <div className="header">
      <h2>Deepfake Detection Dashboard</h2>
      <div className="user-info">
        <img
          src="https://randomuser.me/api/portraits/women/32.jpg"
          alt="User"
        />
        <span>Sakshi Totala</span>
      </div>
    </div>
  );
}

export default Header;
