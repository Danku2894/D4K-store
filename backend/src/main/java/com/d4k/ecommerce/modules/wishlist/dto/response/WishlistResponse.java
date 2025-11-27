package com.d4k.ecommerce.modules.wishlist.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO response cho wishlist
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistResponse {
    
    private Long id;
    
    private Long userId;
    
    private List<WishlistItemResponse> items;
    
    private Integer totalItems; // Tổng số items trong wishlist
}

