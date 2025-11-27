package com.d4k.ecommerce.modules.wishlist.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO response cho wishlist item
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponse {
    
    private Long id;
    
    private Long productId;
    
    private String productName;
    
    private BigDecimal productPrice;
    
    private String productImageUrl;
    
    private Integer productStock;
    
    private Boolean available; // product còn hàng và active
    
    private LocalDateTime addedAt; // createdAt
}

