package com.d4k.ecommerce.modules.recommendation.service.impl;

import com.d4k.ecommerce.modules.order.enums.OrderStatus;
import com.d4k.ecommerce.modules.order.repository.OrderItemRepository;
import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.mapper.ProductMapper;
import com.d4k.ecommerce.modules.product.repository.ProductRepository;
import com.d4k.ecommerce.modules.recommendation.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Recommendation Service Implementation
 * Triển khai các thuật toán đề xuất sản phẩm
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationServiceImpl implements RecommendationService {
    
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductMapper productMapper;
    
    @Override
    public List<ProductResponse> getSimilarProducts(Long productId, int limit) {
        log.info("Getting similar products for productId: {}, limit: {}", productId, limit);
        
        try {
            // Lấy product hiện tại để biết category
            Product currentProduct = productRepository.findById(productId).orElse(null);
            
            if (currentProduct == null || currentProduct.getCategory() == null) {
                log.warn("Product not found or has no category: {}", productId);
                return Collections.emptyList();
            }
            
            Long categoryId = currentProduct.getCategory().getId();
            
            // Lấy sản phẩm cùng category, loại trừ sản phẩm hiện tại
            List<Product> similarProducts = productRepository
                .findByCategoryIdAndIsActiveTrueAndIdNot(
                    categoryId, 
                    productId, 
                    PageRequest.of(0, limit)
                );
            
            return similarProducts.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting similar products: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
    
    @Override
    public List<ProductResponse> getPopularProducts(int limit) {
        log.info("Getting popular products, limit: {}", limit);
        
        try {
            // Lấy top sản phẩm bán chạy từ OrderItem (chỉ tính đơn DELIVERED)
            List<Object[]> topSellingResults = orderItemRepository
                .findTopSellingProducts(
                    OrderStatus.DELIVERED, 
                    PageRequest.of(0, limit)
                );
            
            if (topSellingResults.isEmpty()) {
                // Fallback: nếu chưa có đơn hàng, lấy sản phẩm mới nhất
                log.info("No orders found, falling back to newest products");
                return productRepository
                    .findByIsActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, limit))
                    .getContent()
                    .stream()
                    .map(productMapper::toResponse)
                    .collect(Collectors.toList());
            }
            
            // Extract product IDs from results
            List<Long> productIds = topSellingResults.stream()
                .map(row -> (Long) row[0])
                .collect(Collectors.toList());
            
            // Fetch full product details
            List<Product> products = productRepository.findAllById(productIds);
            
            // Maintain order from top selling query
            return productIds.stream()
                .map(id -> products.stream()
                    .filter(p -> p.getId().equals(id))
                    .findFirst()
                    .orElse(null))
                .filter(p -> p != null && p.getIsActive())
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting popular products: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
