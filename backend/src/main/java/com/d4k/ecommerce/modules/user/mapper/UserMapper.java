package com.d4k.ecommerce.modules.user.mapper;

import com.d4k.ecommerce.modules.user.dto.response.UserDetailResponse;
import com.d4k.ecommerce.modules.user.entity.User;
import org.springframework.stereotype.Component;

/**
 * User Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class UserMapper {
    
    /**
     * Convert User entity sang UserDetailResponse
     */
    public UserDetailResponse toDetailResponse(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDetailResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

