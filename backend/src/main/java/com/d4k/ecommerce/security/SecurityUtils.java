package com.d4k.ecommerce.security;

import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * Security Utilities
 * Helper methods cho security-related operations
 */
@Component
@RequiredArgsConstructor
public class SecurityUtils {
    
    private final UserRepository userRepository;
    
    /**
     * Lấy email của user hiện tại từ SecurityContext
     */
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getName();
    }
    
    /**
     * Lấy User entity của user hiện tại
     */
    public User getCurrentUser() {
        String email = getCurrentUserEmail();
        if (email == null) {
            throw new UsernameNotFoundException("No authenticated user found");
        }
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
    
    /**
     * Lấy user ID của user hiện tại
     */
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
    
    /**
     * Kiểm tra user hiện tại có authenticated không
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
    
    /**
     * Kiểm tra user hiện tại có role cụ thể không
     * @param role tên role (VD: "ADMIN", "USER")
     * @return true nếu user có role đó
     */
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        // Spring Security tự động thêm prefix "ROLE_" vào authorities
        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(roleWithPrefix));
    }
}

