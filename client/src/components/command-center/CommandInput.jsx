// src/components/command-center/CommandInput.jsx
import React, { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import "./CommandInput.css";

export default function CommandInput() {
  const { role } = useAuth();
  const [text, setText] = useState("");
  const [status, setStatus] = useState(null); // "ok" | "err" | null
  const [loading, setLoading] = useState(false);

  // allow both ADMIN and SUPER_ADMIN (case-insensitive)
  const canSend =
    role &&
    ["ADMIN", "SUPER_ADMIN", "admin", "super_admin"].includes(role);

  if (!canSend) return null; // hide completely for unauthorized roles

  const submit = async (e) => {
    e.preventDefault();
    const msg = (text || "").trim();
    if (!msg) return;

    setLoading(true);
    setStatus(null);

    try {
      await api.post("/support", { message: msg });
      setText("");
      setStatus("ok");
      // rely on socket to update lists elsewhere; show a small success
      setTimeout(() => setStatus(null), 1800);
    } catch (err) {
      console.error("Support send failed:", err);
      setStatus("err");
      setTimeout(() => setStatus(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="command-input" onSubmit={submit} role="form" aria-label="Command center">
      <input
        className="command-input__field"
        placeholder="Send a support request to admins..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        aria-label="Support message"
      />
      <button className="command-input__send" type="submit" disabled={loading || !text.trim()}>
        {loading ? "Sending…" : "Send"}
      </button>

      <div className={`command-input__status ${status || ""}`} aria-hidden>
        {status === "ok" && "✓ Sent"}
        {status === "err" && "Failed"}
      </div>
    </form>
  );
}
