// src/pages/Maintenance.jsx
import React, { useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import AddMaintenanceForm from "../../components/tables/AddMaintenanceForm/AddMaintenanceForm";
import MaintenanceTable from "../../components/tables/MaintenanceTable/MaintenanceTable";
import api from "../../services/api";
import { connectSocket } from "../../services/socket"
import "./Maintenance.css";

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchRecords = async () => {
    try {
      const res = await api.get("/maintenance");
      setRecords(res.data);
      setPendingCount(res.data.filter((r) => r && r.status !== "COMPLETED").length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    const socket = connectSocket();

    socket.on("maintenance:logged", fetchRecords);
    socket.on("maintenance:completed", fetchRecords);

    return () => {
      socket.off("maintenance:logged", fetchRecords);
      socket.off("maintenance:completed", fetchRecords);
    };
  }, []);

  return (
    <div className="maintenance-page">
      <div className="cards-container">
        <Card title="Pending Maintenance" value={pendingCount} />
        <Card title="Total Records" value={records.length} />
      </div>

      <AddMaintenanceForm onAdded={() => fetchRecords()} />

      <MaintenanceTable records={records} setRecords={setRecords} />
    </div>
  );
}
