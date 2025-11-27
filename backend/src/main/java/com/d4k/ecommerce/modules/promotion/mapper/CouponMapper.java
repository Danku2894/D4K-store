package com.d4k.ecommerce.modules.promotion.mapper;

import com.d4k.ecommerce.modules.promotion.dto.response.CouponResponse;
import com.d4k.ecommerce.modules.promotion.entity.Coupon;
import org.springframework.stereotype.Component;

/**
 * Coupon Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class CouponMapper {
    
    /**
     * Convert Coupon entity sang CouponResponse
     */
    public CouponResponse toResponse(Coupon coupon) {
        if (coupon == null) {
            return null;
        }
        
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscount(coupon.getMaxDiscount())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .usageLimit(coupon.getUsageLimit())
                .usageCount(coupon.getUsageCount())
                .isActive(coupon.getIsActive())
                .isValid(coupon.isValid()) // Calculated field
                .createdAt(coupon.getCreatedAt())
                .updatedAt(coupon.getUpdatedAt())
                .build();
    }
}

