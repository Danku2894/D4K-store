package com.d4k.ecommerce.modules.auth.dto.response;

import com.d4k.ecommerce.modules.user.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO response cho thông tin user
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Long id;
    
    private String fullName;
    
    private String email;
    
    private String phoneNumber;
    
    private RoleType role;
    
    private LocalDateTime createdAt;
}

