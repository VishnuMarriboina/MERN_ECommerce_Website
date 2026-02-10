import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Login from "./components/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "./Redux/slices/AuthSlice";
import AdminDashboard from "./dashboard/OrgDashboard/Admin/AdminDashboard";
import Ts from "./utils/Ts";

function App() {
  const user = useSelector(selectCurrentUser);

  return (
    // <Routes>
    //   <Route path="/login" element={<Login />} />
    //   <Route
    //     path="/*"
    //     element={
    //       <ProtectedRoute>
    //         {user?.User_Role?.toLowerCase() === "admin" ? (
    //           <AdminDashboard />
    //         ) : (
    //           <Dashboard />
    //         )}
    //       </ProtectedRoute>
    //     }
    //   />
    // </Routes>
    <Ts />
  );
}

export default App;
