package com.d4k.ecommerce.modules.auth.dto.response;

import com.d4k.ecommerce.modules.user.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response cho đăng nhập thành công
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    private String token;
    
    private String tokenType;
    
    private UserResponse user;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String fullName;
        private String email;
        private RoleType role;
    }
}

