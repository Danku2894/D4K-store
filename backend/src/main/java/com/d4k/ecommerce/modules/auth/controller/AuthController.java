package com.d4k.ecommerce.modules.auth.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.auth.dto.request.LoginRequest;
import com.d4k.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.d4k.ecommerce.modules.auth.dto.response.LoginResponse;
import com.d4k.ecommerce.modules.auth.dto.response.UserResponse;
import com.d4k.ecommerce.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Auth Controller
 * REST API endpoints cho authentication
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @org.springframework.beans.factory.annotation.Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @org.springframework.beans.factory.annotation.Value("${app.cookie.same-site:Lax}")
    private String cookieSameSite;
    
    /**
     * Đăng ký tài khoản mới
     * POST /api/v1/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        
        UserResponse userResponse = authService.register(request);
        
        ApiResponse<UserResponse> response = ApiResponse.success(
                userResponse,
                "User registered successfully"
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Đăng nhập
     * POST /api/v1/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse httpServletResponse) {
        log.info("Received login request for email: {}", request.getEmail());
        
        LoginResponse loginResponse = authService.login(request);
        
        // Create HttpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("accessToken", loginResponse.getToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite(cookieSameSite)
                .build();
        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        ApiResponse<LoginResponse> response = ApiResponse.success(
                loginResponse,
                "Login successful"
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Quên mật khẩu
     * POST /api/v1/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody com.d4k.ecommerce.modules.auth.dto.request.ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset link sent to your email"));
    }

    /**
     * Đặt lại mật khẩu
     * POST /api/v1/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody com.d4k.ecommerce.modules.auth.dto.request.ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success(null, "Password successfully reset"));
    }

    /**
     * Đăng xuất
     * POST /api/v1/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = "accessToken", required = false) String cookieToken,
            @RequestHeader(value = "Authorization", required = false) String bearerToken,
            HttpServletResponse httpServletResponse) {
            
        String token = null;
        if (cookieToken != null && !cookieToken.isEmpty()) {
            token = cookieToken;
        } else if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            token = bearerToken.substring(7);
        }
        
        if (token != null) {
            // Blacklist service will handle it
            authService.logout(token);
        }
        
        // Clear cookie
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite(cookieSameSite)
                .build();
        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }
}

