// src/components/tables/SupportTable.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import "./SupportTable.css";

export default function SupportTable({ requests, setRequests }) {
  const { role } = useAuth();

  const [message, setMessageState] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const msgTimer = useRef(null);

  const resolve = async (id) => {
    if (!window.confirm("Mark as resolved?")) return;
    try {
      await api.put(`/support/${id}/resolve`);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "RESOLVED" } : r))
      );
      showMessage("Request resolved", "success");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Failed to resolve", "error");
    }
  };

  function showMessage(text, type = "info", ms = 4000) {
    setMessageType(type);
    setMessageState(text);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    if (ms > 0) msgTimer.current = setTimeout(() => setMessageState(""), ms);
  }

  useEffect(() => {
    return () => {
      if (msgTimer.current) clearTimeout(msgTimer.current);
    };
  }, []);

  const sorted = useMemo(() => {
    const arr = [...(requests || [])];
    if (!sortField) return arr;
    arr.sort((a, b) => {
      const va = ((a[sortField] || "") + "").toString().toLowerCase();
      const vb = ((b[sortField] || "") + "").toString().toLowerCase();
      if (va < vb) return -1 * sortDir;
      if (va > vb) return 1 * sortDir;
      return 0;
    });
    return arr;
  }, [requests, sortField, sortDir]);

  const displayed = sorted;

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => -d);
    else {
      setSortField(field);
      setSortDir(1);
    }
  };

  function exportCSV(list) {
    if (!list || !list.length) return showMessage("No data to export", "error");
    const headers = ["id", "sender", "message", "status", "created_at"];
    const rows = list.map((r) =>
      [
        r.id,
        r.sender || "",
        (r.message || "").replace(/,/g, " "),
        r.status || "",
        r.created_at || "",
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `support_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage("CSV exported", "success");
  }

  function exportJSON(list) {
    if (!list || !list.length) return showMessage("No data to export", "error");
    const blob = new Blob([JSON.stringify(list, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `support_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage("JSON exported", "success");
  }

  return (
    <div className="support-table-container">
      {message && (
        <div className={`support-message ${messageType}`}>{message}</div>
      )}

      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <button onClick={() => exportCSV(displayed)}>Export CSV</button>
        <button onClick={() => exportJSON(displayed)} style={{ marginLeft: 8 }}>
          Export JSON
        </button>
      </div>

      <table className="support-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>
              ID{sortField === "id" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th
              onClick={() => toggleSort("sender")}
              style={{ cursor: "pointer" }}
            >
              Sender
              {sortField === "sender" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th
              onClick={() => toggleSort("message")}
              style={{ cursor: "pointer" }}
            >
              Message
              {sortField === "message" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th
              onClick={() => toggleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status
              {sortField === "status" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th
              onClick={() => toggleSort("created_at")}
              style={{ cursor: "pointer" }}
            >
              Created
              {sortField === "created_at" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.sender}</td>
              <td>{r.message}</td>
              <td>{r.status}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>
                {r.status !== "RESOLVED" ? (
                  <button
                    onClick={() => resolve(r.id)}
                    disabled={role !== "SUPER_ADMIN"}
                  >
                    Resolve
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
