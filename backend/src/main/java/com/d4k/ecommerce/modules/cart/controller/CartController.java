package com.d4k.ecommerce.modules.cart.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.cart.dto.request.AddToCartRequest;
import com.d4k.ecommerce.modules.cart.dto.request.UpdateCartItemRequest;
import com.d4k.ecommerce.modules.cart.dto.response.CartResponse;
import com.d4k.ecommerce.modules.cart.service.CartService;
import com.d4k.ecommerce.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Cart Controller
 * REST API endpoints cho giỏ hàng (yêu cầu authentication)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    private final SecurityUtils securityUtils;
    
    /**
     * Lấy giỏ hàng của user hiện tại
     * GET /api/v1/cart
     */
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        Long userId = getCurrentUserId();
        log.info("User {} fetching cart", userId);
        
        CartResponse cart = cartService.getCart(userId);
        
        ApiResponse<CartResponse> response = ApiResponse.success(
                cart,
                "Cart retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     * POST /api/v1/cart/add
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @Valid @RequestBody AddToCartRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("User {} adding product {} to cart", userId, request.getProductId());
        
        CartResponse cart = cartService.addToCart(userId, request);
        
        ApiResponse<CartResponse> response = ApiResponse.success(
                cart,
                "Product added to cart successfully"
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Cập nhật số lượng cart item
     * PUT /api/v1/cart/update/{itemId}
     */
    @PutMapping("/update/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        
        Long userId = getCurrentUserId();
        log.info("User {} updating cart item {}", userId, itemId);
        
        CartResponse cart = cartService.updateCartItem(userId, itemId, request);
        
        ApiResponse<CartResponse> response = ApiResponse.success(
                cart,
                "Cart item updated successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa item khỏi giỏ hàng
     * DELETE /api/v1/cart/remove/{itemId}
     */
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeCartItem(@PathVariable Long itemId) {
        Long userId = getCurrentUserId();
        log.info("User {} removing cart item {}", userId, itemId);
        
        CartResponse cart = cartService.removeCartItem(userId, itemId);
        
        ApiResponse<CartResponse> response = ApiResponse.success(
                cart,
                "Cart item removed successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa toàn bộ giỏ hàng
     * DELETE /api/v1/cart/clear
     */
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        Long userId = getCurrentUserId();
        log.info("User {} clearing cart", userId);
        
        cartService.clearCart(userId);
        
        ApiResponse<Void> response = ApiResponse.success("Cart cleared successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Helper method: Lấy user ID từ SecurityContext
     */
    private Long getCurrentUserId() {
        return securityUtils.getCurrentUserId();
    }
}

