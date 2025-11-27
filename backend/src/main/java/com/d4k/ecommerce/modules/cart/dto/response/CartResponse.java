package com.d4k.ecommerce.modules.cart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO response cho cart
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    
    private Long id;
    
    private Long userId;
    
    private List<CartItemResponse> items;
    
    private Integer totalItems; // Tổng số items
    
    private BigDecimal totalAmount; // Tổng tiền
}

