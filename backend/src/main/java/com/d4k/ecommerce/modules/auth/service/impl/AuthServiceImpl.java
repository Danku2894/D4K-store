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
import com.d4k.ecommerce.security.jwt.TokenBlacklistService;
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
    private final TokenBlacklistService tokenBlacklistService;
    private final com.d4k.ecommerce.common.service.EmailService emailService;
    
    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;
    
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
                .phoneNumber(savedUser.getPhoneNumber())
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
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
        
        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
    }
    
    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        // Tránh leak thông tin user: luôn trả về success dù email có tồn tại hay không
        if (user == null) {
            log.info("Password reset requested for non-existent email: {}", email);
            return;
        }

        String token = java.util.UUID.randomUUID().toString();
        user.setResetPasswordToken(token); // Lý tưởng nên hash bằng SHA-256
        user.setResetPasswordTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15)); // Token valid for 15 mins
        
        userRepository.save(user);

        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String emailBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'>" +
                "<style>" +
                "body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0a0a0a; margin: 0; padding: 20px; }" +
                ".container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 4px solid #0a0a0a; padding: 30px; text-align: center; }" +
                ".header { border-bottom: 4px solid #0a0a0a; padding-bottom: 20px; margin-bottom: 20px; }" +
                ".header h1 { font-size: 32px; font-weight: 900; text-transform: uppercase; margin: 0; letter-spacing: -1px; }" +
                ".header h1 span { color: #e63946; }" +
                "h2 { font-size: 24px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; }" +
                "p { font-size: 16px; line-height: 1.5; font-weight: 500; }" +
                ".btn { display: inline-block; background-color: #0a0a0a; color: #ffffff !important; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; border: 2px solid transparent; margin: 25px 0; font-size: 16px; }" +
                ".warning { color: #e63946; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-top: 20px; }" +
                ".footer { margin-top: 30px; padding-top: 20px; border-top: 2px dashed #0a0a0a; font-weight: bold; text-transform: uppercase; font-size: 12px; }" +
                "</style>" +
                "</head><body>" +
                "<div class='container'>" +
                "<div class='header'><h1>D4K<span>STORE</span></h1></div>" +
                "<h2>PASSWORD RESET REQUEST</h2>" +
                "<p>HI <b>" + user.getFullName().toUpperCase() + "</b>,</p>" +
                "<p>WE RECEIVED A REQUEST TO RESET YOUR PASSWORD. CLICK THE BUTTON BELOW TO SET A NEW ONE.</p>" +
                "<a href='" + resetLink + "' class='btn'>RESET PASSWORD</a>" +
                "<p class='warning'>THIS LINK WILL EXPIRE IN 15 MINUTES.</p>" +
                "<p style='font-size: 12px; color: #64748b; font-weight: bold;'>IF YOU DID NOT REQUEST THIS, PLEASE IGNORE THIS EMAIL OR CONTACT SUPPORT.</p>" +
                "<div class='footer'>STAY STREET. D4K STORE.</div>" +
                "</div></body></html>";

        emailService.sendEmail(email, "Password Reset Request", emailBody);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new BusinessException("Invalid token", ErrorCodes.INVALID_TOKEN));

        if (user.getResetPasswordTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new BusinessException("Token expired", ErrorCodes.TOKEN_EXPIRED);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }

    @Override
    public void logout(String token) {
        if (jwtTokenProvider.validateToken(token)) {
            java.util.Date expiration = jwtTokenProvider.getExpirationDateFromToken(token);
            if (expiration != null) {
                tokenBlacklistService.blacklistToken(token, expiration.toInstant());
                log.info("Token blacklisted successfully");
            }
        }
    }
}

