package com.d4k.ecommerce.modules.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO response cho address
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    
    private Long id;
    
    private String receiverName;
    
    private String phone;
    
    private String address;
    
    private String ward;
    
    private String district;
    
    private String city;
    
    private Boolean isDefault;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

