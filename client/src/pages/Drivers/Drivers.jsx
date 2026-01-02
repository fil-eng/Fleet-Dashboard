// src/pages/Drivers.jsx
import React, { useEffect, useState } from "react";
import AddDriverForm from "../../components/tables/AddDriverForm/AddDriverForm";
import DriverTable from "../../components/tables/DriverTable/DriverTable";
import Card from "../../components/cards/Card";
import api from "../../services/api";
import { connectSocket } from "../../services/socket";
import "./Drivers.css";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/drivers");
      setDrivers(res.data);
      setActiveCount(res.data.filter((d) => d.status === "ASSIGNED" || d.status === "ACTIVE").length);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    const socket = connectSocket();

    // keep simple: re-fetch on changes
    socket.on("driver:created", fetchDrivers);
    socket.on("assignment:assigned", fetchDrivers);
    socket.on("assignment:unassigned", fetchDrivers);

    return () => {
      socket.off("driver:created", fetchDrivers);
      socket.off("assignment:assigned", fetchDrivers);
      socket.off("assignment:unassigned", fetchDrivers);
    };
  }, []);

  return (
    <div className="drivers-page">
      <div className="cards-container">
        <Card title="Active Drivers" value={activeCount} />
        <Card title="Total Drivers" value={drivers.length} />
      </div>

      <AddDriverForm onAdded={(newDriver) => setDrivers((p) => [...p, newDriver])} />

      <DriverTable drivers={drivers} setDrivers={setDrivers} />
    </div>
  );
}
