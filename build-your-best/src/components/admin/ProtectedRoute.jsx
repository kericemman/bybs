import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { defaultAdminPath, hasPermission, isFullAdmin } from "../../utils/adminPermissions";

const ProtectedRoute = ({ children, permission, adminOnly = false }) => {
  const { admin, loading } = useAuth();

  if (loading) return null;
  if (!admin) return <Navigate to="/admin/login" />;
  if (adminOnly && !isFullAdmin(admin)) return <Navigate to={defaultAdminPath(admin)} replace />;
  if (permission && !hasPermission(admin, permission)) {
    return <Navigate to={defaultAdminPath(admin)} replace />;
  }

  return children;
};

export default ProtectedRoute;
