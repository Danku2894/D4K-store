package com.d4k.ecommerce.modules.cart.service.impl;

import com.d4k.ecommerce.common.constants.ErrorCodes;
import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.modules.cart.dto.request.AddToCartRequest;
import com.d4k.ecommerce.modules.cart.dto.request.UpdateCartItemRequest;
import com.d4k.ecommerce.modules.cart.dto.response.CartResponse;
import com.d4k.ecommerce.modules.cart.entity.Cart;
import com.d4k.ecommerce.modules.cart.entity.CartItem;
import com.d4k.ecommerce.modules.cart.mapper.CartMapper;
import com.d4k.ecommerce.modules.cart.repository.CartItemRepository;
import com.d4k.ecommerce.modules.cart.repository.CartRepository;
import com.d4k.ecommerce.modules.cart.service.CartService;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.repository.ProductRepository;
import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Cart Service Implementation
 * Xử lý business logic cho giỏ hàng
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;
    
    /**
     * Lấy giỏ hàng của user
     */
    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        log.info("Fetching cart for user ID: {}", userId);
        
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> getOrCreateCart(userId));
        
        return cartMapper.toCartResponse(cart);
    }
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @Override
    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        log.info("Adding product {} to cart for user {}", request.getProductId(), userId);
        
        // Get or create cart
        Cart cart = getOrCreateCart(userId);
        
        // Validate product tồn tại và active
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> {
                    log.error("Product not found with ID: {}", request.getProductId());
                    return new ResourceNotFoundException("Product", "id", request.getProductId());
                });
        
        if (!product.getIsActive()) {
            throw new BusinessException("Product is not available", "PRODUCT_NOT_AVAILABLE");
        }
        
        // Kiểm tra stock
        if (product.getStock() < request.getQuantity()) {
            log.error("Insufficient stock for product {}. Requested: {}, Available: {}", 
                    product.getId(), request.getQuantity(), product.getStock());
            throw new BusinessException(
                    String.format("Insufficient stock. Only %d items available", product.getStock()),
                    ErrorCodes.INSUFFICIENT_STOCK
            );
        }
        
        // Kiểm tra product đã có trong cart chưa
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(
                cart.getId(), product.getId());
        
        if (existingItem.isPresent()) {
            // Update quantity nếu đã tồn tại
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            
            // Kiểm tra stock cho quantity mới
            if (product.getStock() < newQuantity) {
                throw new BusinessException(
                        String.format("Insufficient stock. Only %d items available", product.getStock()),
                        ErrorCodes.INSUFFICIENT_STOCK
                );
            }
            
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
            log.info("Updated quantity for existing cart item: {}", item.getId());
        } else {
            // Thêm item mới
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
            log.info("Added new cart item for product: {}", product.getId());
        }
        
        // Refresh cart
        Cart updatedCart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        
        return cartMapper.toCartResponse(updatedCart);
    }
    
    /**
     * Cập nhật số lượng cart item
     */
    @Override
    @Transactional
    public CartResponse updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        log.info("Updating cart item {} for user {}", itemId, userId);
        
        // Validate cart item thuộc về user
        if (!cartItemRepository.existsByIdAndUserId(itemId, userId)) {
            throw new ResourceNotFoundException("Cart item", "id", itemId);
        }
        
        // Get cart item với product
        CartItem cartItem = cartItemRepository.findByIdWithProduct(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));
        
        // Kiểm tra stock
        Product product = cartItem.getProduct();
        if (product.getStock() < request.getQuantity()) {
            throw new BusinessException(
                    String.format("Insufficient stock. Only %d items available", product.getStock()),
                    ErrorCodes.INSUFFICIENT_STOCK
            );
        }
        
        // Update quantity
        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);
        log.info("Cart item {} updated to quantity: {}", itemId, request.getQuantity());
        
        // Return updated cart
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        
        return cartMapper.toCartResponse(cart);
    }
    
    /**
     * Xóa item khỏi giỏ hàng
     */
    @Override
    @Transactional
    public CartResponse removeCartItem(Long userId, Long itemId) {
        log.info("Removing cart item {} for user {}", itemId, userId);
        
        // Validate cart item thuộc về user
        if (!cartItemRepository.existsByIdAndUserId(itemId, userId)) {
            throw new ResourceNotFoundException("Cart item", "id", itemId);
        }
        
        // Delete cart item
        cartItemRepository.deleteById(itemId);
        log.info("Cart item {} removed successfully", itemId);
        
        // Return updated cart
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        
        return cartMapper.toCartResponse(cart);
    }
    
    /**
     * Xóa toàn bộ giỏ hàng
     */
    @Override
    @Transactional
    public void clearCart(Long userId) {
        log.info("Clearing cart for user {}", userId);
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        
        cart.getItems().clear();
        cartRepository.save(cart);
        log.info("Cart cleared successfully for user {}", userId);
    }
    
    /**
     * Helper method: Get hoặc tạo cart mới cho user
     */
    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    log.info("Creating new cart for user {}", userId);
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    
                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();
                    
                    return cartRepository.save(newCart);
                });
    }
}

