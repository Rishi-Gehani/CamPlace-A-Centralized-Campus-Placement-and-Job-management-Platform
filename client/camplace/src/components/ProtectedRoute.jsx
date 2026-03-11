import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to home and open login modal
    return <Navigate to="/" state={{ openAuth: 'login', from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    // If user is not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
