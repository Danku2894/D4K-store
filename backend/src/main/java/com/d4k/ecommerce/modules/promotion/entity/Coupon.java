package com.d4k.ecommerce.modules.promotion.entity;

import com.d4k.ecommerce.modules.promotion.enums.DiscountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Coupon Entity
 * Quản lý mã giảm giá / khuyến mãi
 */
@Entity
@Table(name = "coupons",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_coupon_code", columnNames = "code")
    },
    indexes = {
        @Index(name = "idx_coupon_code", columnList = "code"),
        @Index(name = "idx_coupon_dates", columnList = "start_date, end_date"),
        @Index(name = "idx_coupon_active", columnList = "is_active")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Mã coupon (unique, uppercase)
     * Ví dụ: SUMMER2025, FLASH50
     */
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;
    
    /**
     * Tên / Mô tả coupon
     */
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    /**
     * Mô tả chi tiết
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    /**
     * Loại giảm giá (PERCENTAGE / FIXED_AMOUNT)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType;
    
    /**
     * Giá trị giảm giá
     * - Nếu PERCENTAGE: 0-100 (%)
     * - Nếu FIXED_AMOUNT: số tiền (VND)
     */
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;
    
    /**
     * Giá trị đơn hàng tối thiểu để áp dụng coupon
     * Null = không giới hạn
     */
    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount;
    
    /**
     * Số tiền giảm tối đa (cho PERCENTAGE)
     * Null = không giới hạn
     */
    @Column(name = "max_discount", precision = 10, scale = 2)
    private BigDecimal maxDiscount;
    
    /**
     * Ngày bắt đầu hiệu lực
     */
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    /**
     * Ngày hết hiệu lực
     */
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;
    
    /**
     * Giới hạn số lần sử dụng
     * Null = không giới hạn
     */
    @Column(name = "usage_limit")
    private Integer usageLimit;
    
    /**
     * Số lần đã sử dụng
     */
    @Column(name = "usage_count", nullable = false)
    @Builder.Default
    private Integer usageCount = 0;
    
    /**
     * Trạng thái active
     */
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * Check xem coupon có hợp lệ không
     */
    public boolean isValid() {
        if (!isActive) return false;
        
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(startDate) || now.isAfter(endDate)) {
            return false;
        }
        
        // Check usage limit
        if (usageLimit != null && usageCount >= usageLimit) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Tăng usage count
     */
    public void incrementUsageCount() {
        this.usageCount++;
    }
}

