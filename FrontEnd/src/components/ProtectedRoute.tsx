// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1️⃣ Đang restore auth (sau reload / PayPal redirect)
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        Đang xác thực người dùng...
      </div>
    );
  }

  // 2️⃣ Chưa đăng nhập
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  // 3️⃣ Đã đăng nhập → cho đi tiếp
  return <Outlet />;
}
