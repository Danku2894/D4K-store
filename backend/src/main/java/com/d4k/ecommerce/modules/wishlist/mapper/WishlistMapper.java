package com.d4k.ecommerce.modules.wishlist.mapper;

import com.d4k.ecommerce.modules.wishlist.dto.response.WishlistItemResponse;
import com.d4k.ecommerce.modules.wishlist.dto.response.WishlistResponse;
import com.d4k.ecommerce.modules.wishlist.entity.Wishlist;
import com.d4k.ecommerce.modules.wishlist.entity.WishlistItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Wishlist Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class WishlistMapper {
    
    /**
     * Convert WishlistItem entity sang WishlistItemResponse
     */
    public WishlistItemResponse toWishlistItemResponse(WishlistItem wishlistItem) {
        if (wishlistItem == null || wishlistItem.getProduct() == null) {
            return null;
        }
        
        var product = wishlistItem.getProduct();
        boolean available = product.getIsActive() && product.getStock() > 0;
        
        return WishlistItemResponse.builder()
                .id(wishlistItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .productImageUrl(product.getImageUrl())
                .productStock(product.getStock())
                .available(available)
                .addedAt(wishlistItem.getCreatedAt())
                .build();
    }
    
    /**
     * Convert Wishlist entity sang WishlistResponse
     */
    public WishlistResponse toWishlistResponse(Wishlist wishlist) {
        if (wishlist == null) {
            return null;
        }
        
        List<WishlistItemResponse> itemResponses = wishlist.getItems().stream()
                .map(this::toWishlistItemResponse)
                .collect(Collectors.toList());
        
        return WishlistResponse.builder()
                .id(wishlist.getId())
                .userId(wishlist.getUser() != null ? wishlist.getUser().getId() : null)
                .items(itemResponses)
                .totalItems(itemResponses.size())
                .build();
    }
}

