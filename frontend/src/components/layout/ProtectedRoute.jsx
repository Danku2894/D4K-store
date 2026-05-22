import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '@services/auth-service';

/**
 * Component bảo vệ các route yêu cầu người dùng phải đăng nhập
 * Nếu đã đăng nhập -> Hiển thị Outlet (các component con)
 * Nếu chưa đăng nhập -> Chuyển hướng về trang /login
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Chuyển hướng đến login page, lưu lại vị trí hiện tại để quay lại sau khi login thành công
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
