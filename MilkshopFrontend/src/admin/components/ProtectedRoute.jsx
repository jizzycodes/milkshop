import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, initialized, admin } = useAdminAuth();
  const location = useLocation();

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (adminOnly && admin?.role !== "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

