import CommandInput from "../../command-center/CommandInput";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <Outlet />
        </div>
         <CommandInput />
      </div>
    </div>
  );
}
