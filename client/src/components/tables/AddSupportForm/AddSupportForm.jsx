// src/components/tables/AddSupportForm.jsx
import React, { useState } from "react";
import api from "../../../services/api";
import "./AddSupportForm.css";

export default function AddSupportForm({ onAdded }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert("Message required");

    setLoading(true);
    try {
      await api.post("/support", { message });
      setMessage("");
      onAdded && onAdded();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send support request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-support-form" onSubmit={submit}>
      <input placeholder="Write support request..." value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send"}</button>
    </form>
  );
}
