package com.d4k.ecommerce.modules.recommendation.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.recommendation.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Recommendation Controller
 * REST API endpoints cho recommendation system
 */
@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
@Slf4j
public class RecommendationController {
    
    private final RecommendationService recommendationService;
    
    /**
     * Lấy sản phẩm tương tự (cùng category)
     * GET /api/v1/recommendations/similar/{productId}?limit=8
     */
    @GetMapping("/similar/{productId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getSimilarProducts(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "8") int limit
    ) {
        log.info("Getting similar products for productId: {}, limit: {}", productId, limit);
        
        List<ProductResponse> products = recommendationService.getSimilarProducts(productId, limit);
        
        ApiResponse<List<ProductResponse>> response = ApiResponse.<List<ProductResponse>>builder()
                .success(true)
                .message("Similar products fetched successfully")
                .data(products)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy sản phẩm phổ biến (được mua nhiều nhất)
     * GET /api/v1/recommendations/popular?limit=8
     */
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPopularProducts(
            @RequestParam(defaultValue = "8") int limit
    ) {
        log.info("Getting popular products, limit: {}", limit);
        
        List<ProductResponse> products = recommendationService.getPopularProducts(limit);
        
        ApiResponse<List<ProductResponse>> response = ApiResponse.<List<ProductResponse>>builder()
                .success(true)
                .message("Popular products fetched successfully")
                .data(products)
                .build();
        
        return ResponseEntity.ok(response);
    }
}
