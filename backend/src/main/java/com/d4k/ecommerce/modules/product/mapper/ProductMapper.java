package com.d4k.ecommerce.modules.product.mapper;

import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.product.entity.Product;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Product Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class ProductMapper {
    
    /**
     * Convert Product entity sang ProductResponse
     */
    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }
        
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .isActive(product.getIsActive())
                .inStock(product.getStock() != null && product.getStock() > 0)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert list of products to responses
     */
    public List<ProductResponse> toResponseList(List<Product> products) {
        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}

