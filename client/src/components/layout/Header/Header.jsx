// Header.jsx
import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <a href="/">
        <h1>Fleet Dashboard</h1>
      </a>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </header>
  );
}
