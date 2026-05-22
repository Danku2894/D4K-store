import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '@services/auth-service';

/**
 * Component bảo vệ các route yêu cầu quyền ADMIN
 * Nếu là ADMIN -> Hiển thị Outlet (các component con)
 * Nếu không phải ADMIN -> Chuyển hướng về trang chủ hoặc đăng nhập
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    // Nếu đã đăng nhập nhưng không phải ADMIN, đá về trang chủ
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
