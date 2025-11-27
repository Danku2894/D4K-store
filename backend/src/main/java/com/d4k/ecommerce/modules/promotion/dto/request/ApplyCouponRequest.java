package com.d4k.ecommerce.modules.promotion.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO request cho việc áp dụng coupon
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyCouponRequest {
    
    @NotBlank(message = "Coupon code is required")
    private String code;
    
    @NotNull(message = "Order amount is required")
    private BigDecimal orderAmount;
}

