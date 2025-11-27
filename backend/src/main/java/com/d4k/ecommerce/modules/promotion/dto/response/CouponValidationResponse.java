package com.d4k.ecommerce.modules.promotion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO response cho việc validate và tính toán coupon
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponValidationResponse {
    
    private String code;
    
    private String name;
    
    private Boolean isValid;
    
    private String message;
    
    private BigDecimal originalAmount;
    
    private BigDecimal discountAmount;
    
    private BigDecimal finalAmount;
}

