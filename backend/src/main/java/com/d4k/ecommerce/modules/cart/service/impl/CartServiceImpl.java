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
import com.d4k.ecommerce.modules.product.entity.ProductVariant;
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
    @Transactional
    public CartResponse getCart(Long userId) {
        log.info("Fetching cart for user ID: {}", userId);
        
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> getOrCreateCart(userId));
        
        // Validate items and remove invalid ones (e.g. variant deleted)
        boolean cartUpdated = false;
        java.util.Iterator<CartItem> iterator = cart.getItems().iterator();
        
        while (iterator.hasNext()) {
            CartItem item = iterator.next();
            Product product = item.getProduct();
            
            if (item.getSize() != null) {
                boolean variantExists = product.getVariants().stream()
                        .anyMatch(v -> v.getSize().equalsIgnoreCase(item.getSize()) && 
                                      (item.getColor() == null || (v.getColor() != null && v.getColor().equalsIgnoreCase(item.getColor()))));
                
                if (!variantExists) {
                    log.warn("Removing invalid cart item {} (Variant not found: {} - {})", item.getId(), product.getName(), item.getSize());
                    iterator.remove();
                    cartItemRepository.delete(item); // Explicitly delete from DB
                    cartUpdated = true;
                }
            }
        }
        
        if (cartUpdated) {
            cart = cartRepository.save(cart);
        }
        
        return cartMapper.toCartResponse(cart);
    }
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @Override
    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        log.info("Adding product {} to cart for user {}", request.getProductId(), userId);
        
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> getOrCreateCart(userId));
                
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));
                
        // Check stock based on variant
        int availableStock = 0;
        if (request.getSize() != null) {
            ProductVariant variant = product.getVariants().stream()
                    .filter(v -> v.getSize().equalsIgnoreCase(request.getSize()))
                    .filter(v -> request.getColor() == null || (v.getColor() != null && v.getColor().equalsIgnoreCase(request.getColor())))
                    .findFirst()
                    .orElseThrow(() -> new BusinessException(
                            String.format("Variant not found for product '%s' (Size: %s, Color: %s)", 
                                    product.getName(), request.getSize(), request.getColor()), 
                            "VARIANT_NOT_FOUND"));
            availableStock = variant.getStock();
        } else {
             // Fallback to total stock if no size specified (should be improved)
             availableStock = product.getTotalStock();
        }
        
        // Check existing item
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductIdAndSize(
                cart.getId(), product.getId(), request.getSize());
                
        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            
            if (newQuantity > availableStock) {
                throw new BusinessException(
                        String.format("Insufficient stock. Only %d items available", availableStock),
                        ErrorCodes.INSUFFICIENT_STOCK
                );
            }
            
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
            log.info("Updated quantity for existing cart item: {}", item.getId());
        } else {
            // Add new item
            if (request.getQuantity() > availableStock) {
                throw new BusinessException(
                        String.format("Insufficient stock. Only %d items available", availableStock),
                        ErrorCodes.INSUFFICIENT_STOCK
                );
            }
            
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .size(request.getSize())
                    .color(request.getColor())
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
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));
                
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
             throw new ResourceNotFoundException("Cart item", "id", itemId);
        }
        
        // Check stock
        Product product = cartItem.getProduct();
        int availableStock = 0;
        if (cartItem.getSize() != null) {
             ProductVariant variant = product.getVariants().stream()
                    .filter(v -> v.getSize().equalsIgnoreCase(cartItem.getSize()))
                    .findFirst()
                    .orElse(null);
             availableStock = variant != null ? variant.getStock() : 0;
        } else {
            availableStock = product.getTotalStock();
        }
        
        if (request.getQuantity() > availableStock) {
             throw new BusinessException(
                    String.format("Insufficient stock. Only %d items available", availableStock),
                    ErrorCodes.INSUFFICIENT_STOCK
            );
        }
        
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
        
        if (!cartItemRepository.existsByIdAndUserId(itemId, userId)) {
            throw new ResourceNotFoundException("Cart item", "id", itemId);
        }
        
        cartItemRepository.deleteById(itemId);
        log.info("Cart item {} removed successfully", itemId);
        
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
