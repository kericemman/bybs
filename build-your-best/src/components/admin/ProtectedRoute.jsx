import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { defaultAdminPath, hasPermission, isFullAdmin } from "../../utils/adminPermissions";
import SEO from "../SEO";
import BrandLoader from "../public/BrandLoader";

const ProtectedRoute = ({ children, permission, adminOnly = false }) => {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return <BrandLoader label="Checking admin access" fullPage className="bg-[#F7F9FC]" />;
  if (!admin) return <Navigate to="/admin/login" />;
  if (admin.mustChangePassword && location.pathname !== "/admin/change-password") {
    return <Navigate to="/admin/change-password" replace />;
  }
  if (adminOnly && !isFullAdmin(admin)) return <Navigate to={defaultAdminPath(admin)} replace />;
  if (permission && !hasPermission(admin, permission)) {
    return <Navigate to={defaultAdminPath(admin)} replace />;
  }

  return (
    <>
      <SEO title="BYBS Admin" noindex />
      {children}
    </>
  );
};

export default ProtectedRoute;
