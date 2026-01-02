import React, { useState } from "react";
import api from "../../../services/api";
import "./AddVehicleForm.css";

export default function AddVehicleForm({ onAdded }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) return alert("Plate number is required");

    setLoading(true);
    try {
      const res = await api.post("/vehicles", {
        plate_number: plateNumber,
        model,
      });

      setPlateNumber("");
      setModel("");
      onAdded(res.data); // add new vehicle to table
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-vehicle-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Plate Number"
        value={plateNumber}
        onChange={(e) => setPlateNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Vehicle"}
      </button>
    </form>
  );
}
