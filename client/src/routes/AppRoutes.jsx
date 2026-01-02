import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout/DashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Vehicles from "../pages/Vehicles/Vehicles";
import ProtectedRoute from "./ProtectedRoute";
import Drivers from "./../pages/Drivers/Drivers";
import Maintenance from "../pages/Maintenance/Maintenance";
import Support from "../pages/Support/Support";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout /> {/* your Header/Sidebar/Outlet layout */}
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="maintenance" element={<Maintenance />} />
        {/* Support route protected to SUPER_ADMIN */}
        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <Support />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
