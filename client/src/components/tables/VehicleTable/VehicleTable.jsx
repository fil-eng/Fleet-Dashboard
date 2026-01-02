import React, { useState, useMemo, useRef, useEffect } from "react";
import api from "../../../services/api";
import "./VehicleTable.css";

export default function VehicleTable({ vehicles, setVehicles }) {
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessageState] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const msgTimer = useRef(null);

  const handleEdit = (id) => setEditId(id);
  const handleCancel = () => setEditId(null);

  const handleChange = (id, field, value) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSave = async (vehicle) => {
    try {
      await api.put(`/vehicles/${vehicle.id}`, vehicle);
      setEditId(null);
      showMessage("Vehicle updated", "success");
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to update vehicle",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this vehicle?")) return;

    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showMessage("Vehicle deleted", "success");
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to delete vehicle",
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

  const safeSearch = (search || "").toLowerCase();

  const filteredVehicles = useMemo(() => {
    return (vehicles || []).filter((v) =>
      (v.plate_number || "").toLowerCase().includes(safeSearch)
    );
  }, [vehicles, safeSearch]);

  const sorted = useMemo(() => {
    const arr = [...filteredVehicles];
    if (!sortField) return arr;
    arr.sort((a, b) => {
      const va = ((a[sortField] || "") + "").toString().toLowerCase();
      const vb = ((b[sortField] || "") + "").toString().toLowerCase();
      if (va < vb) return -1 * sortDir;
      if (va > vb) return 1 * sortDir;
      return 0;
    });
    return arr;
  }, [filteredVehicles, sortField, sortDir]);

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
    const headers = ["id", "plate_number", "model", "status"];
    const rows = list.map((r) =>
      headers.map((h) => ((r[h] ?? "") + "").replace(/,/g, " ")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehicles_export_${Date.now()}.csv`;
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
    a.download = `vehicles_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage("JSON exported", "success");
  }

  return (
    <div className="vehicle-table-container">
      {message && (
        <div className={`vehicle-message ${messageType}`}>{message}</div>
      )}
      <input
        type="text"
        placeholder="Search plate number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="vehicle-search"
      />

      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <button onClick={() => exportCSV(displayed)}>Export CSV</button>
        <button onClick={() => exportJSON(displayed)} style={{ marginLeft: 8 }}>
          Export JSON
        </button>
      </div>

      <table className="vehicle-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>
              ID{sortField === "id" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
            </th>
            <th
              onClick={() => toggleSort("plate_number")}
              style={{ cursor: "pointer" }}
            >
              Plate Number
              {sortField === "plate_number"
                ? sortDir === 1
                  ? " ▲"
                  : " ▼"
                : ""}
            </th>
            <th
              onClick={() => toggleSort("model")}
              style={{ cursor: "pointer" }}
            >
              Model{sortField === "model" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
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
          {displayed.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>
                {editId === vehicle.id ? (
                  <input
                    value={vehicle.plate_number}
                    onChange={(e) =>
                      handleChange(vehicle.id, "plate_number", e.target.value)
                    }
                  />
                ) : (
                  vehicle.plate_number
                )}
              </td>
              <td>
                {editId === vehicle.id ? (
                  <input
                    value={vehicle.model}
                    onChange={(e) =>
                      handleChange(vehicle.id, "model", e.target.value)
                    }
                  />
                ) : (
                  vehicle.model
                )}
              </td>
              <td>{vehicle.status}</td>
              <td>
                {editId === vehicle.id ? (
                  <>
                    <button onClick={() => handleSave(vehicle)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(vehicle.id)}>Edit</button>
                    <button onClick={() => handleDelete(vehicle.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
