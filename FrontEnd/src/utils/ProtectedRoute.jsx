import { Navigate } from "react-router-dom";
import { useAuth } from "../Redux/features/auth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Fix: If user is undefined (still loading from persist), don't redirect yet
  if (user === undefined) {
    return null; // or loading spinner
  }

  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
