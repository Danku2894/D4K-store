package com.d4k.ecommerce.modules.product.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO response cho product
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {
    
    private Long id;
    
    private String name;
    
    private String description;
    
    private BigDecimal price;
    
    private Integer stock;
    
    private String imageUrl;

    private java.util.List<String> additionalImages;
    
    private Long categoryId;
    
    private String categoryName;
    
    private String categorySizeGuide;
    
    private Boolean isActive;
    
    private Boolean isSale;
    
    private Integer saleDiscountPercentage;
    
    private BigDecimal salePrice; // Computed field: price - (price * percentage / 100)
    
    private Boolean inStock; // Computed field: stock > 0
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    private java.util.List<ProductVariantResponse> variants;
}

