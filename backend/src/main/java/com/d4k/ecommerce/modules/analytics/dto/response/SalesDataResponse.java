package com.d4k.ecommerce.modules.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO response cho sales data (doanh thu)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesDataResponse {
    
    private String period; // "DAILY", "MONTHLY", "YEARLY"
    private List<SalesDataPoint> data;
    private BigDecimal totalRevenue;
    private Long totalOrders;
    
    /**
     * Data point cho từng khoảng thời gian
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesDataPoint {
        private String date; // "2025-11-27" hoặc "2025-11" hoặc "2025"
        private BigDecimal revenue;
        private Long orderCount;
    }
}

