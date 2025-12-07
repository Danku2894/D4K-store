package com.d4k.ecommerce.modules.product.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO request cho tạo/cập nhật product
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    
    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 200, message = "Product name must be between 3 and 200 characters")
    private String name;
    
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 digits and 2 decimal places")
    private BigDecimal price;
    
    @Min(value = 0, message = "Stock must be non-negative")
    private Integer stock;

    private java.util.List<ProductVariantRequest> variants;
    
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    private java.util.List<String> additionalImages;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    private Boolean isActive;
}

