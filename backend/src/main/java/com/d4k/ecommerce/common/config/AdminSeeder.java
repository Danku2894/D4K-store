package com.d4k.ecommerce.common.config;

import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.enums.RoleType;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createAdminUser() {
        return args -> {
            String adminEmail = "admin@d4kstore.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                log.info("Creating default ADMIN user...");
                
                User admin = User.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123")) // Default password
                        .fullName("Super Admin")
                        .phoneNumber("0123456789")
                        .role(RoleType.ADMIN)
                        .isActive(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                
                userRepository.save(admin);
                log.info("ADMIN user created successfully: {}", adminEmail);
            } else {
                log.info("ADMIN user already exists.");
            }
        };
    }
}
