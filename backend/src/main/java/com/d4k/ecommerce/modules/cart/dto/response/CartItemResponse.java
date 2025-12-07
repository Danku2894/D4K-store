package com.d4k.ecommerce.modules.cart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO response cho cart item
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    
    private Long id;
    
    private Long productId;
    
    private String productName;
    
    private BigDecimal productPrice;
    
    private String productImageUrl;
    
    private Integer quantity;
    
    private BigDecimal subtotal; // price * quantity
    
    private String size;
    private String color;
    private Integer stock;

    private Boolean available; // product còn đủ stock không
}

