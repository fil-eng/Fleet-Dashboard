// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// Helper to decode JWT payload (no verification, just read)
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    const p = parseJwt(t);
    return (p && (p.role || p?.user?.role)) || localStorage.getItem("role") || null;
  });

  useEffect(() => {
    // keep localStorage consistent if token changes
    if (token) {
      localStorage.setItem("token", token);
      const p = parseJwt(token);
      const resolvedRole = (p && (p.role || p?.user?.role)) || localStorage.getItem("role");
      if (resolvedRole) {
        localStorage.setItem("role", resolvedRole);
        setRole(resolvedRole);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setRole(null);
    }
  }, [token]);

  // login accepts token OR (token, role)
  function login(newToken, explicitRole = null) {
    setToken(newToken);
    if (explicitRole) {
      setRole(explicitRole);
      localStorage.setItem("role", explicitRole);
    } else {
      const p = parseJwt(newToken);
      const r = (p && (p.role || p?.user?.role)) || null;
      if (r) {
        setRole(r);
        localStorage.setItem("role", r);
      }
    }
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
