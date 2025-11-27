package com.d4k.ecommerce.modules.user.dto.response;

import com.d4k.ecommerce.modules.user.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO response cho chi tiết user (Admin)
 * Bao gồm nhiều thông tin hơn UserResponse
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse {
    
    private Long id;
    
    private String fullName;
    
    private String email;
    
    private RoleType role;
    
    private Boolean isActive;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

