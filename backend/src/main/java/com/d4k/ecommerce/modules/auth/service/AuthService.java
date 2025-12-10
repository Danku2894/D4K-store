package com.d4k.ecommerce.modules.auth.service;

import com.d4k.ecommerce.modules.auth.dto.request.LoginRequest;
import com.d4k.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.d4k.ecommerce.modules.auth.dto.response.LoginResponse;
import com.d4k.ecommerce.modules.auth.dto.response.UserResponse;

/**
 * Auth Service Interface
 * Định nghĩa business logic cho authentication
 */
public interface AuthService {
    
    /**
     * Đăng ký tài khoản mới
     * @param request thông tin đăng ký
     * @return thông tin user đã tạo
     */
    UserResponse register(RegisterRequest request);
    
    /**
     * Đăng nhập
     * @param request thông tin đăng nhập
     * @return token và thông tin user
     */
    LoginResponse login(LoginRequest request);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);
}

