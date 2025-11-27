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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @Valid @RequestBody LoginRequest request) {
        log.info("Received login request for email: {}", request.getEmail());
        
        LoginResponse loginResponse = authService.login(request);
        
        ApiResponse<LoginResponse> response = ApiResponse.success(
                loginResponse,
                "Login successful"
        );
        
        return ResponseEntity.ok(response);
    }
}

