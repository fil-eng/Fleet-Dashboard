// src/components/tables/AddMaintenanceForm.jsx
import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./AddMaintenanceForm.css";

export default function AddMaintenanceForm({ onAdded }) {
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // default date to today
    if (!date) {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId || !description) return alert("Vehicle and description required");

    setLoading(true);
    try {
      await api.post("/maintenance", {
        vehicle_id: vehicleId,
        description,
        maintenance_date: date,
      });

      setVehicleId("");
      setDescription("");
      onAdded && onAdded();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to log maintenance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-maintenance-form" onSubmit={handleSubmit}>
      <input placeholder="Vehicle ID" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Log Maintenance"}</button>
    </form>
  );
}
