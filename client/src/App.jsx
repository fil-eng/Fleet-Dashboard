// import { useEffect, useState } from "react";
// import Header from "../src/components/layout/Header/Header";
// import Sidebar from "../src/components/layout/Sidebar/Sidebar";
// import RouterPage from "./router";
// import Login from "../src/pages/Login/Login"; 

// export default function App() {
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     }
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return <div style={{ padding: "2rem" }}>Loading...</div>;
//   }

//   // 🔐 NOT AUTHENTICATED → LOGIN ONLY
//   if (!token) {
//     return <Login onLogin={setToken} />;
//   }

//   // ✅ AUTHENTICATED → DASHBOARD LAYOUT
//   return (
//     <div className="app-container">
//       <Header />
//       <div className="main-content">
//         <Sidebar />
//         <div className="page-content">
//           <RouterPage />
//         </div>
//       </div>
//     </div>
//   );
// }
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
      <AppRoutes />
  );
}

export default App;

