import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Login from "./components/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useAuth } from "./Redux/features/auth";
import AdminDashboard from "./dashboard/OrgDashboard/Admin/AdminDashboard";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            {user?.User_Role?.toLowerCase() === "admin" ? (
              <AdminDashboard />
            ) : (
              <Dashboard />
            )}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
