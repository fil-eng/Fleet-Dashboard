// src/components/tables/AddDriverForm.jsx
import React, { useState } from "react";
import api from "../../../services/api";
import "./AddDriverForm.css";

export default function AddDriverForm({ onAdded }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return alert("Driver name is required");

    setLoading(true);
    try {
      const res = await api.post("/drivers", { full_name: fullName, phone });
      // backend returns id on create — if not, refresh list via socket
      onAdded && onAdded({ id: res.data.id || Date.now(), full_name: fullName, phone, status: "AVAILABLE" });
      setFullName("");
      setPhone("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-driver-form" onSubmit={handleSubmit}>
      <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Driver full name" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" />
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Driver"}</button>
    </form>
  );
}
