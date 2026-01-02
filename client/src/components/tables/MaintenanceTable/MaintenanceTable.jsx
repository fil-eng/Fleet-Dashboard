// src/components/tables/MaintenanceTable.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import "./MaintenanceTable.css";

export default function MaintenanceTable({ records, setRecords }) {
  const { role } = useAuth();

  const [message, setMessageState] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const msgTimer = useRef(null);

  const complete = async (vehicleId) => {
    if (!window.confirm("Mark maintenance complete for this vehicle?")) return;
    try {
      await api.post(`/maintenance/complete/${vehicleId}`);
      // refresh list — backend will emit socket, but also update locally
      setRecords((prev) =>
        prev.map((r) =>
          r.vehicle_id === vehicleId ? { ...r, status: "COMPLETED" } : r
        )
      );
      showMessage("Maintenance marked complete", "success");
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to complete maintenance",
        "error"
      );
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
    const arr = [...(records || [])];
    if (!sortField) return arr;
    arr.sort((a, b) => {
      const va = (a[sortField] || "").toString().toLowerCase();
      const vb = (b[sortField] || "").toString().toLowerCase();
      if (va < vb) return -1 * sortDir;
      if (va > vb) return 1 * sortDir;
      return 0;
    });
    return arr;
  }, [records, sortField, sortDir]);

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
    const headers = [
      "id",
      "vehicle",
      "description",
      "maintenance_date",
      "status",
    ];
    const rows = list.map((r) =>
      [
        r.id,
        r.plate_number || r.vehicle_id || "",
        r.description || "",
        r.maintenance_date || "",
        r.status || "",
      ]
        .map((v) => ("" + (v ?? "")).replace(/,/g, " "))
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maintenance_export_${Date.now()}.csv`;
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
    a.download = `maintenance_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage("JSON exported", "success");
  }

  return (
    <div className="maintenance-table-container">
      {message && (
        <div className={`maintenance-message ${messageType}`}>{message}</div>
      )}

      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <button onClick={() => exportCSV(displayed)}>Export CSV</button>
        <button onClick={() => exportJSON(displayed)} style={{ marginLeft: 8 }}>
          Export JSON
        </button>
      </div>

      <table className="maintenance-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>
              ID{sortField === "id" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th
              onClick={() => toggleSort("plate_number")}
              style={{ cursor: "pointer" }}
            >
              Vehicle
              {sortField === "plate_number"
                ? sortDir === 1
                  ? " ▲"
                  : " ▼"
                : ""}
            </th>
            <th
              onClick={() => toggleSort("description")}
              style={{ cursor: "pointer" }}
            >
              Description
              {sortField === "description" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th
              onClick={() => toggleSort("maintenance_date")}
              style={{ cursor: "pointer" }}
            >
              Date
              {sortField === "maintenance_date"
                ? sortDir === 1
                  ? " ▲"
                  : " ▼"
                : ""}
            </th>
            <th
              onClick={() => toggleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status
              {sortField === "status" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.plate_number || r.vehicle_id}</td>
              <td>{r.description}</td>
              <td>{r.maintenance_date}</td>
              <td>{r.status || "PENDING"}</td>
              <td>
                {r.status !== "COMPLETED" ? (
                  <button onClick={() => complete(r.vehicle_id)}>
                    Complete
                  </button>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
