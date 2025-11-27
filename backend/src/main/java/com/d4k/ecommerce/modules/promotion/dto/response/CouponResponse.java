package com.d4k.ecommerce.modules.promotion.dto.response;

import com.d4k.ecommerce.modules.promotion.enums.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO response cho coupon
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {
    
    private Long id;
    
    private String code;
    
    private String name;
    
    private String description;
    
    private DiscountType discountType;
    
    private BigDecimal discountValue;
    
    private BigDecimal minOrderAmount;
    
    private BigDecimal maxDiscount;
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private Integer usageLimit;
    
    private Integer usageCount;
    
    private Boolean isActive;
    
    private Boolean isValid; // Calculated field
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

