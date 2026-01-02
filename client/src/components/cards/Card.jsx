import React from "react";
import "./Card.css";

export default function Card({ title, value }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
    </div>
  );
}
