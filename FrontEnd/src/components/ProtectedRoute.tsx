// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    // Lưu lại trang người dùng đang muốn vào
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // QUAN TRỌNG: Dùng Outlet thay vì children
  return <Outlet />;
}