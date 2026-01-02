import { Routes, Route, Navigate } from "react-router-dom";
import Vehicles from "../src/pages/Vehicles/Vehicles";
// import Drivers from "../src/pages";
// import Maintenance from "../pages/Maintenance";
// import Support from "../pages/Support";

export default function RouterPage() {
  return (
    <Routes>
      <Route path="/" element={<Vehicles />} />
      {/* <Route path="/login" element={<Vehicles />} /> */}
      <Route path="/Vehicles" element={<Vehicles />} />
      {/* <Route path="/drivers" element={<Drivers />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/support" element={<Support />} />
      <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}
