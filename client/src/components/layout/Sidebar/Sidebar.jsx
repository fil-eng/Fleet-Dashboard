// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { role } = useAuth();

  return (
    <aside className="sidebar">
      <NavLink to="/vehicles">Vehicles</NavLink>
      <NavLink to="/drivers">Drivers</NavLink>
      <NavLink to="/maintenance">Maintenance</NavLink>
      {role === "SUPER_ADMIN" && <NavLink to="/support">Support</NavLink>}
    </aside>
  );
}
