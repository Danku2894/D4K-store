package com.d4k.ecommerce.modules.wishlist.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.wishlist.dto.request.AddToWishlistRequest;
import com.d4k.ecommerce.modules.wishlist.dto.response.WishlistResponse;
import com.d4k.ecommerce.modules.wishlist.service.WishlistService;
import com.d4k.ecommerce.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Wishlist Controller
 * REST API endpoints cho wishlist (yêu cầu authentication)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    
    private final WishlistService wishlistService;
    private final SecurityUtils securityUtils;
    
    /**
     * Lấy wishlist của user hiện tại
     * GET /api/v1/wishlist
     */
    @GetMapping
    public ResponseEntity<ApiResponse<WishlistResponse>> getWishlist() {
        Long userId = securityUtils.getCurrentUserId();
        log.info("User {} fetching wishlist", userId);
        
        WishlistResponse wishlist = wishlistService.getWishlist(userId);
        
        ApiResponse<WishlistResponse> response = ApiResponse.success(
                wishlist,
                "Wishlist retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Thêm sản phẩm vào wishlist
     * POST /api/v1/wishlist/add
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(
            @Valid @RequestBody AddToWishlistRequest request) {
        
        Long userId = securityUtils.getCurrentUserId();
        log.info("User {} adding product {} to wishlist", userId, request.getProductId());
        
        WishlistResponse wishlist = wishlistService.addToWishlist(userId, request.getProductId());
        
        ApiResponse<WishlistResponse> response = ApiResponse.success(
                wishlist,
                "Product added to wishlist successfully"
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Xóa sản phẩm khỏi wishlist
     * DELETE /api/v1/wishlist/remove/{productId}
     */
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<WishlistResponse>> removeFromWishlist(
            @PathVariable Long productId) {
        
        Long userId = securityUtils.getCurrentUserId();
        log.info("User {} removing product {} from wishlist", userId, productId);
        
        WishlistResponse wishlist = wishlistService.removeFromWishlist(userId, productId);
        
        ApiResponse<WishlistResponse> response = ApiResponse.success(
                wishlist,
                "Product removed from wishlist successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa toàn bộ wishlist
     * DELETE /api/v1/wishlist/clear
     */
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearWishlist() {
        Long userId = securityUtils.getCurrentUserId();
        log.info("User {} clearing wishlist", userId);
        
        wishlistService.clearWishlist(userId);
        
        ApiResponse<Void> response = ApiResponse.success("Wishlist cleared successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Kiểm tra product có trong wishlist không
     * GET /api/v1/wishlist/check/{productId}
     */
    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkProductInWishlist(
            @PathVariable Long productId) {
        
        Long userId = securityUtils.getCurrentUserId();
        log.info("User {} checking product {} in wishlist", userId, productId);
        
        Boolean inWishlist = wishlistService.isProductInWishlist(userId, productId);
        
        ApiResponse<Boolean> response = ApiResponse.success(
                inWishlist,
                inWishlist ? "Product is in wishlist" : "Product is not in wishlist"
        );
        
        return ResponseEntity.ok(response);
    }
}

