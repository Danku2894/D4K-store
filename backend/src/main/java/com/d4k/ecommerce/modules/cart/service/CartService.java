package com.d4k.ecommerce.modules.cart.service;

import com.d4k.ecommerce.modules.cart.dto.request.AddToCartRequest;
import com.d4k.ecommerce.modules.cart.dto.request.UpdateCartItemRequest;
import com.d4k.ecommerce.modules.cart.dto.response.CartResponse;

/**
 * Cart Service Interface
 * Định nghĩa business logic cho giỏ hàng
 */
public interface CartService {
    
    /**
     * Lấy giỏ hàng của user
     * @param userId user ID
     * @return thông tin giỏ hàng
     */
    CartResponse getCart(Long userId);
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     * @param userId user ID
     * @param request thông tin product và quantity
     * @return giỏ hàng sau khi thêm
     */
    CartResponse addToCart(Long userId, AddToCartRequest request);
    
    /**
     * Cập nhật số lượng cart item
     * @param userId user ID
     * @param itemId cart item ID
     * @param request quantity mới
     * @return giỏ hàng sau khi cập nhật
     */
    CartResponse updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request);
    
    /**
     * Xóa item khỏi giỏ hàng
     * @param userId user ID
     * @param itemId cart item ID
     * @return giỏ hàng sau khi xóa
     */
    CartResponse removeCartItem(Long userId, Long itemId);
    
    /**
     * Xóa toàn bộ giỏ hàng (clear cart)
     * @param userId user ID
     */
    void clearCart(Long userId);
}

