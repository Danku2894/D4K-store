package com.d4k.ecommerce.modules.promotion.dto.request;

import com.d4k.ecommerce.modules.promotion.enums.DiscountType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO request cho tạo/cập nhật coupon
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
    
    @NotBlank(message = "Coupon code is required")
    @Size(min = 3, max = 50, message = "Coupon code must be between 3 and 50 characters")
    @Pattern(regexp = "^[A-Z0-9_-]+$", message = "Coupon code must contain only uppercase letters, numbers, underscore and dash")
    private String code;
    
    @NotBlank(message = "Coupon name is required")
    @Size(max = 200, message = "Coupon name must not exceed 200 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Discount type is required")
    private DiscountType discountType;
    
    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.01", message = "Discount value must be greater than 0")
    private BigDecimal discountValue;
    
    @DecimalMin(value = "0", message = "Min order amount must be non-negative")
    private BigDecimal minOrderAmount;
    
    @DecimalMin(value = "0", message = "Max discount must be non-negative")
    private BigDecimal maxDiscount;
    
    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;
    
    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
    
    @Min(value = 1, message = "Usage limit must be at least 1")
    private Integer usageLimit;
    
    @NotNull(message = "Active status is required")
    private Boolean isActive;
}

