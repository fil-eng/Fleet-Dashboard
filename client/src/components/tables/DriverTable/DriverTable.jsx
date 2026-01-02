// src/components/tables/DriverTable.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import "./DriverTable.css";

export default function DriverTable({ drivers, setDrivers }) {
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [assignVehicleId, setAssignVehicleId] = useState("");
  const [assigningFor, setAssigningFor] = useState(null);
  const [message, setMessageState] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(1); // 1 = asc, -1 = desc
  const msgTimer = useRef(null);
  const { role } = useAuth();

  const handleEdit = (id) => setEditId(id);
  const handleCancel = () => setEditId(null);

  const handleChange = (id, field, value) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = async (driver) => {
    try {
      await api.put(`/drivers/${driver.id}`, driver);
      setEditId(null);
      showMessage("Driver updated", "success");
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to update driver",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await api.delete(`/drivers/${id}`);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      showMessage("Driver deleted", "success");
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to delete driver",
        "error"
      );
    }
  };

  const openAssign = (driverId) => {
    setAssigningFor(driverId);
    setAssignVehicleId("");
  };

  const doAssign = async () => {
    if (!assignVehicleId)
      return showMessage("Enter vehicle id to assign", "error");
    try {
      await api.post("/drivers/assign", {
        driverId: assigningFor,
        vehicleId: assignVehicleId,
      });
      // optimistic local update: refresh via socket or simple state update
      setAssigningFor(null);
      setAssignVehicleId("");
      showMessage("Driver assigned", "success");
      // ideally backend emits socket; but also refresh remotely via fetch triggered by socket
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to assign driver",
        "error"
      );
    }
  };

  const doUnassign = async (driverId) => {
    try {
      await api.post(`/drivers/${driverId}/unassign`);
      showMessage("Driver unassigned", "success");
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Failed to unassign driver",
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
  const filtered = useMemo(() => {
    return (drivers || []).filter(
      (d) =>
        (d.full_name || "").toLowerCase().includes(safeSearch) ||
        (d.phone || "").toLowerCase().includes(safeSearch)
    );
  }, [drivers, safeSearch]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (!sortField) return arr;
    arr.sort((a, b) => {
      const va = (a[sortField] || "").toString().toLowerCase();
      const vb = (b[sortField] || "").toString().toLowerCase();
      if (va < vb) return -1 * sortDir;
      if (va > vb) return 1 * sortDir;
      return 0;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const displayed = sorted;

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => -d);
    } else {
      setSortField(field);
      setSortDir(1);
    }
  };

  function exportCSV(list) {
    if (!list || !list.length) return showMessage("No data to export", "error");
    const headers = ["id", "full_name", "phone", "status"];
    const rows = list.map((r) =>
      headers.map((h) => (r[h] ?? "") + "").join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `drivers_export_${Date.now()}.csv`;
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
    a.download = `drivers_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage("JSON exported", "success");
  }

  return (
    <div className="driver-table-container">
      {message && (
        <div className={`driver-message ${messageType}`}>{message}</div>
      )}
      <input
        className="driver-search"
        placeholder="Search name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <button onClick={() => exportCSV(displayed)}>Export CSV</button>
        <button onClick={() => exportJSON(displayed)} style={{ marginLeft: 8 }}>
          Export JSON
        </button>
      </div>

      <table className="driver-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full name</th>
            <th>Phone</th>
            <th>Status</th>
            <th style={{ minWidth: 220 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((driver) => (
            <tr key={driver.id}>
              <td
                onClick={() => toggleSort("id")}
                style={{ cursor: "pointer" }}
              >
                {driver.id}
                {sortField === "id" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
              </td>
              <td
                onClick={() => toggleSort("full_name")}
                style={{ cursor: "pointer" }}
              >
                {editId === driver.id ? (
                  <input
                    value={driver.full_name}
                    onChange={(e) =>
                      handleChange(driver.id, "full_name", e.target.value)
                    }
                  />
                ) : (
                  <>
                    {driver.full_name}
                    {sortField === "full_name"
                      ? sortDir === 1
                        ? " ▲"
                        : " ▼"
                      : ""}
                  </>
                )}
              </td>
              <td
                onClick={() => toggleSort("phone")}
                style={{ cursor: "pointer" }}
              >
                {editId === driver.id ? (
                  <input
                    value={driver.phone || ""}
                    onChange={(e) =>
                      handleChange(driver.id, "phone", e.target.value)
                    }
                  />
                ) : (
                  <>
                    {driver.phone || ""}
                    {sortField === "phone" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
                  </>
                )}
              </td>
              <td
                onClick={() => toggleSort("status")}
                style={{ cursor: "pointer" }}
              >
                {driver.status}
                {sortField === "status" ? (sortDir === 1 ? " ▲" : " ▼") : ""}
              </td>
              <td>
                {editId === driver.id ? (
                  <>
                    <button onClick={() => handleSave(driver)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(driver.id)}>Edit</button>
                    {role === "SUPER_ADMIN" ? (
                      <button onClick={() => handleDelete(driver.id)}>
                        Delete
                      </button>
                    ) : (
                      <button disabled title="Only Super Admin can delete">
                        Delete
                      </button>
                    )}
                    {driver.status !== "ASSIGNED" ? (
                      <button onClick={() => openAssign(driver.id)}>
                        Assign
                      </button>
                    ) : (
                      <button onClick={() => doUnassign(driver.id)}>
                        Unassign
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assigningFor && (
        <div className="assign-panel">
          <div>Assign driver ID {assigningFor} to vehicle id:</div>
          <input
            value={assignVehicleId}
            onChange={(e) => setAssignVehicleId(e.target.value)}
            placeholder="Vehicle id"
          />
          <button onClick={doAssign}>Assign</button>
          <button onClick={() => setAssigningFor(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
