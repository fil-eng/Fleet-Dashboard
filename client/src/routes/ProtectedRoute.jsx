// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Usage:
 * <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
 *   <SupportPage />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // If user authenticated but not allowed, send to home
    return <Navigate to="/" replace />;
  }

  return children;
}
