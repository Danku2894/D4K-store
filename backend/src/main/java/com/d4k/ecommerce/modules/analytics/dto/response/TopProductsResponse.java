package com.d4k.ecommerce.modules.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO response cho top selling products
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopProductsResponse {
    
    private List<TopProductItem> topProducts;
    
    /**
     * Item cho từng sản phẩm
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductItem {
        private Long productId;
        private String productName;
        private String categoryName;
        private BigDecimal price;
        private String imageUrl;
        private Long totalSold; // Tổng số lượng đã bán (TODO: from Order)
        private BigDecimal totalRevenue; // Tổng doanh thu (TODO: from Order)
        private Long reviewCount; // Số lượng reviews
        private Double averageRating; // Rating trung bình
    }
}

