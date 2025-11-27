package com.d4k.ecommerce.modules.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO response cho dashboard overview statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewResponse {
    
    // User Statistics
    private Long totalUsers;
    private Long newUsersThisMonth;
    private Long activeUsers;
    
    // Product Statistics
    private Long totalProducts;
    private Long activeProducts;
    private Long lowStockProducts;
    private Long outOfStockProducts;
    
    // Order Statistics (TODO: Implement sau khi có Order module)
    private Long totalOrders;
    private Long pendingOrders;
    private Long completedOrders;
    private Long cancelledOrders;
    
    // Revenue Statistics (TODO: Implement sau khi có Order module)
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private BigDecimal revenueThisYear;
    private BigDecimal averageOrderValue;
    
    // Review Statistics
    private Long totalReviews;
    private Double averageRating;
    
    // Coupon Statistics
    private Long totalCoupons;
    private Long activeCoupons;
    private Long expiredCoupons;
}

