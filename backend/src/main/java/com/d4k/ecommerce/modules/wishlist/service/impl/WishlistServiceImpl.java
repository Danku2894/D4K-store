package com.d4k.ecommerce.modules.wishlist.service.impl;

import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.repository.ProductRepository;
import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import com.d4k.ecommerce.modules.wishlist.dto.response.WishlistResponse;
import com.d4k.ecommerce.modules.wishlist.entity.Wishlist;
import com.d4k.ecommerce.modules.wishlist.entity.WishlistItem;
import com.d4k.ecommerce.modules.wishlist.mapper.WishlistMapper;
import com.d4k.ecommerce.modules.wishlist.repository.WishlistItemRepository;
import com.d4k.ecommerce.modules.wishlist.repository.WishlistRepository;
import com.d4k.ecommerce.modules.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Wishlist Service Implementation
 * Xử lý business logic cho wishlist
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistMapper wishlistMapper;
    
    /**
     * Lấy wishlist của user
     */
    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getWishlist(Long userId) {
        log.info("Fetching wishlist for user ID: {}", userId);
        
        Wishlist wishlist = wishlistRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> getOrCreateWishlist(userId));
        
        return wishlistMapper.toWishlistResponse(wishlist);
    }
    
    /**
     * Thêm sản phẩm vào wishlist
     */
    @Override
    @Transactional
    public WishlistResponse addToWishlist(Long userId, Long productId) {
        log.info("Adding product {} to wishlist for user {}", productId, userId);
        
        // Get or create wishlist
        Wishlist wishlist = getOrCreateWishlist(userId);
        
        // Kiểm tra product đã có trong wishlist chưa
        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            log.warn("Product {} already in wishlist for user {}", productId, userId);
            throw new BusinessException("Product already in wishlist", "PRODUCT_ALREADY_IN_WISHLIST");
        }
        
        // Validate product tồn tại
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.error("Product not found with ID: {}", productId);
                    return new ResourceNotFoundException("Product", "id", productId);
                });
        
        // Thêm item mới vào wishlist
        WishlistItem newItem = WishlistItem.builder()
                .wishlist(wishlist)
                .product(product)
                .build();
        
        wishlist.addItem(newItem);
        wishlistItemRepository.save(newItem);
        log.info("Product {} added to wishlist successfully", productId);
        
        // Refresh wishlist
        Wishlist updatedWishlist = wishlistRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "userId", userId));
        
        return wishlistMapper.toWishlistResponse(updatedWishlist);
    }
    
    /**
     * Xóa sản phẩm khỏi wishlist
     */
    @Override
    @Transactional
    public WishlistResponse removeFromWishlist(Long userId, Long productId) {
        log.info("Removing product {} from wishlist for user {}", productId, userId);
        
        // Get wishlist
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "userId", userId));
        
        // Kiểm tra product có trong wishlist không
        if (!wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            log.error("Product {} not found in wishlist for user {}", productId, userId);
            throw new ResourceNotFoundException("Wishlist item", "productId", productId);
        }
        
        // Xóa item
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
        log.info("Product {} removed from wishlist successfully", productId);
        
        // Return updated wishlist
        Wishlist updatedWishlist = wishlistRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "userId", userId));
        
        return wishlistMapper.toWishlistResponse(updatedWishlist);
    }
    
    /**
     * Xóa toàn bộ wishlist
     */
    @Override
    @Transactional
    public void clearWishlist(Long userId) {
        log.info("Clearing wishlist for user {}", userId);
        
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "userId", userId));
        
        wishlist.getItems().clear();
        wishlistRepository.save(wishlist);
        log.info("Wishlist cleared successfully for user {}", userId);
    }
    
    /**
     * Kiểm tra product có trong wishlist không
     */
    @Override
    @Transactional(readOnly = true)
    public Boolean isProductInWishlist(Long userId, Long productId) {
        return wishlistItemRepository.existsByProductIdAndUserId(productId, userId);
    }
    
    /**
     * Helper method: Get hoặc tạo wishlist mới cho user
     */
    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    log.info("Creating new wishlist for user {}", userId);
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    
                    Wishlist newWishlist = Wishlist.builder()
                            .user(user)
                            .build();
                    
                    return wishlistRepository.save(newWishlist);
                });
    }
}

