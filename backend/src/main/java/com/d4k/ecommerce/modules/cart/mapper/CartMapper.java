package com.d4k.ecommerce.modules.cart.mapper;

import com.d4k.ecommerce.modules.cart.dto.response.CartItemResponse;
import com.d4k.ecommerce.modules.cart.dto.response.CartResponse;
import com.d4k.ecommerce.modules.cart.entity.Cart;
import com.d4k.ecommerce.modules.cart.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Cart Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class CartMapper {
    
    /**
     * Convert CartItem entity sang CartItemResponse
     */
    public CartItemResponse toCartItemResponse(CartItem cartItem) {
        if (cartItem == null || cartItem.getProduct() == null) {
            return null;
        }
        
        BigDecimal price = cartItem.getProduct().getPrice();
        Integer quantity = cartItem.getQuantity();
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(quantity));
        
        // Check availability: product còn đủ stock không
        boolean available = cartItem.getProduct().getStock() >= quantity;
        
        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .productPrice(price)
                .productImageUrl(cartItem.getProduct().getImageUrl())
                .quantity(quantity)
                .subtotal(subtotal)
                .available(available)
                .build();
    }
    
    /**
     * Convert Cart entity sang CartResponse
     */
    public CartResponse toCartResponse(Cart cart) {
        if (cart == null) {
            return null;
        }
        
        // Map items
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
        
        // Calculate totals
        int totalItems = itemResponses.size();
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .items(itemResponses)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }
}

