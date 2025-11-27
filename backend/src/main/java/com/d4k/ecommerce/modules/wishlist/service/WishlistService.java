package com.d4k.ecommerce.modules.wishlist.service;

import com.d4k.ecommerce.modules.wishlist.dto.response.WishlistResponse;

/**
 * Wishlist Service Interface
 * Định nghĩa business logic cho wishlist
 */
public interface WishlistService {
    
    /**
     * Lấy wishlist của user
     * @param userId user ID
     * @return thông tin wishlist
     */
    WishlistResponse getWishlist(Long userId);
    
    /**
     * Thêm sản phẩm vào wishlist
     * @param userId user ID
     * @param productId product ID
     * @return wishlist sau khi thêm
     */
    WishlistResponse addToWishlist(Long userId, Long productId);
    
    /**
     * Xóa sản phẩm khỏi wishlist
     * @param userId user ID
     * @param productId product ID
     * @return wishlist sau khi xóa
     */
    WishlistResponse removeFromWishlist(Long userId, Long productId);
    
    /**
     * Xóa toàn bộ wishlist
     * @param userId user ID
     */
    void clearWishlist(Long userId);
    
    /**
     * Kiểm tra product có trong wishlist không
     * @param userId user ID
     * @param productId product ID
     * @return true nếu có trong wishlist
     */
    Boolean isProductInWishlist(Long userId, Long productId);
}

