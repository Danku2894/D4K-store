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

    public WishlistItemResponse toWishlistItemResponse(WishlistItem item) {
        if (item == null) return null;
        
        return WishlistItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productPrice(item.getProduct().getPrice())
                .productImageUrl(item.getProduct().getImageUrl())
                .productStock(item.getProduct().getTotalStock())
                .available(item.getProduct().getTotalStock() > 0 && item.getProduct().getIsActive())
                .addedAt(item.getCreatedAt())
                .build();
    }
}
