package com.d4k.ecommerce.modules.auth.service.impl;

import com.d4k.ecommerce.common.constants.ErrorCodes;
import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.UnauthorizedException;
import com.d4k.ecommerce.modules.auth.dto.request.LoginRequest;
import com.d4k.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.d4k.ecommerce.modules.auth.dto.response.LoginResponse;
import com.d4k.ecommerce.modules.auth.dto.response.UserResponse;
import com.d4k.ecommerce.modules.auth.service.AuthService;
import com.d4k.ecommerce.modules.cart.entity.Cart;
import com.d4k.ecommerce.modules.cart.repository.CartRepository;
import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.enums.RoleType;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import com.d4k.ecommerce.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Auth Service Implementation
 * Xử lý business logic cho authentication
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * Đăng ký tài khoản mới
     */
    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Processing registration for email: {}", request.getEmail());
        
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            log.error("Email already exists: {}", request.getEmail());
            throw new BusinessException("Email already exists", ErrorCodes.EMAIL_ALREADY_EXISTS);
        }
        
        // Tạo user mới
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Hash password
                .role(RoleType.USER) // Mặc định là USER
                .isActive(true)
                .build();
        
        // Lưu vào database
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        // Tạo cart cho user
        Cart cart = Cart.builder()
                .user(savedUser)
                .build();
        cartRepository.save(cart);
        log.info("Cart created for user ID: {}", savedUser.getId());
        
        // Map sang response DTO
        return UserResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }
    
    /**
     * Đăng nhập
     */
    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Processing login for email: {}", request.getEmail());
        
        // Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("Invalid credentials for email: {}", request.getEmail());
                    return new UnauthorizedException("Invalid email or password");
                });
        
        // Kiểm tra password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Invalid password for email: {}", request.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }
        
        // Kiểm tra account có active không
        if (!user.getIsActive()) {
            log.error("Account is inactive for email: {}", request.getEmail());
            throw new UnauthorizedException("Account is inactive");
        }
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());
        log.info("User logged in successfully: {}", user.getEmail());
        
        // Tạo response
        LoginResponse.UserResponse userResponse = LoginResponse.UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
        
        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
    }
}

