package com.d4k.ecommerce.modules.wishlist.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO request cho thêm sản phẩm vào wishlist
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToWishlistRequest {
    
    @NotNull(message = "Product ID is required")
    private Long productId;
}

