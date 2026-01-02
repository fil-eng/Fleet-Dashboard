// src/pages/Support.jsx
import React, { useEffect, useState } from "react";
import AddSupportForm from "../../components/tables/AddSupportForm/AddSupportForm";
import SupportTable from "../../components/tables/SupportTable/SupportTable";
import api from "../../services/api";
import { connectSocket } from "../../services/socket";
import "./Support.css";

export default function Support() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/support");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    const socket = connectSocket();
    socket.on("support:new", fetchRequests);
    socket.on("support:resolved", fetchRequests);
    

    return () => {
      socket.off("support:new", fetchRequests);
      socket.off("support:resolved", fetchRequests);
    };
  }, []);

  return (
    <div className="support-page">
      {/* <AddSupportForm onAdded={() => fetchRequests()} /> */}
      <SupportTable requests={requests} setRequests={setRequests} />
    </div>
  );
}
