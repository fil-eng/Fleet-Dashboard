import React, { useState, useEffect } from "react";
import Card from "../../components/cards/Card";
import VehicleTable from "../../components/tables/VehicleTable/VehicleTable";
import AddVehicleForm from "../../components/tables/AddVehicleForm.j/AddVehicleForm";
import { connectSocket } from "../../services/socket";
import api from "../../services/api";
import "./Vehicles.css";
export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
      setActiveCount(res.data.filter((v) => v.status === "ACTIVE").length);
      setMaintenanceCount(res.data.filter((v) => v.status === "IN_MAINTENANCE").length);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch vehicles");
    }
  };

  useEffect(() => {
    fetchVehicles();
    const socket = connectSocket();

    socket.on("vehicle:created", fetchVehicles);
    socket.on("vehicle:updated", fetchVehicles);
    socket.on("vehicle:deleted", fetchVehicles);

    return () => {
      socket.off("vehicle:created", fetchVehicles);
      socket.off("vehicle:updated", fetchVehicles);
      socket.off("vehicle:deleted", fetchVehicles);
    };
  }, []);

  return (
    <div className="vehicles-page">
      <div className="cards-container">
        <Card title="Active Vehicles" value={activeCount} />
        <Card title="In Maintenance" value={maintenanceCount} />
        <Card title="Total Vehicles" value={vehicles.length} />
      </div>

      <AddVehicleForm onAdded={(newVehicle) => setVehicles((prev) => [...prev, newVehicle])} />

      <VehicleTable vehicles={vehicles} setVehicles={setVehicles} />
    </div>
  );
}

