import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectCurrentUser } from "../Redux/slices/AuthSlice";

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);

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
