import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Login from "./components/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./Redux/slices/AuthSlice";
import AdminDashboard from "./dashboard/OrgDashboard/Admin/AdminDashboard";
import Todo from "../src/pages/Todo";

function App() {
  const user = useSelector(selectCurrentUser);

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
    // <Todo />
  );
}

export default App;
