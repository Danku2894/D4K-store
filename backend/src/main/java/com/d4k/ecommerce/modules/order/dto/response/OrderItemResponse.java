package com.d4k.ecommerce.modules.order.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO response cho order item
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    
    private Long id;
    
    private Long productId;
    
    private String productName;
    
    private BigDecimal price;
    
    private Integer quantity;
    
    private BigDecimal subtotal;

    private String size;
    private String color;
    
    private String imageUrl;
}
