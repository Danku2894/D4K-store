package com.d4k.ecommerce.modules.order.service.impl;

import com.d4k.ecommerce.common.constants.ErrorCodes;
import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.common.exception.UnauthorizedException;
import com.d4k.ecommerce.common.service.EmailService;
import com.d4k.ecommerce.modules.cart.entity.Cart;
import com.d4k.ecommerce.modules.cart.entity.CartItem;
import com.d4k.ecommerce.modules.cart.repository.CartItemRepository;
import com.d4k.ecommerce.modules.cart.repository.CartRepository;
import com.d4k.ecommerce.modules.order.dto.request.CancelOrderRequest;
import com.d4k.ecommerce.modules.order.dto.request.CreateOrderRequest;
import com.d4k.ecommerce.modules.order.dto.request.UpdateOrderStatusRequest;
import com.d4k.ecommerce.modules.order.dto.response.OrderResponse;
import com.d4k.ecommerce.modules.order.entity.Order;
import com.d4k.ecommerce.modules.order.entity.OrderItem;
import com.d4k.ecommerce.modules.order.enums.OrderStatus;
import com.d4k.ecommerce.modules.order.enums.PaymentStatus;
import com.d4k.ecommerce.modules.order.mapper.OrderMapper;
import com.d4k.ecommerce.modules.order.repository.OrderRepository;
import com.d4k.ecommerce.modules.order.service.OrderService;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.entity.ProductVariant;
import com.d4k.ecommerce.modules.product.repository.ProductRepository;
import com.d4k.ecommerce.modules.product.repository.ProductVariantRepository;
import com.d4k.ecommerce.modules.promotion.entity.Coupon;
import com.d4k.ecommerce.modules.promotion.repository.CouponRepository;
import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Order Service Implementation
 * Xử lý business logic cho orders
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final OrderMapper orderMapper;
    private final EmailService emailService;

    private static final BigDecimal DEFAULT_SHIPPING_FEE = new BigDecimal("30000.00");
    
    /**
     * Tạo order từ cart
     */
    @Override
    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        log.info("Creating order for user {}", userId);
        
        // 1. Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                
        // 2. Get cart
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    // If cart not found, create a new one (to avoid error, though it will be empty)
                    log.info("Cart not found for user {}, creating new one", userId);
                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();
                    return cartRepository.save(newCart);
                });

        if (cart.getItems().isEmpty()) {
            // Fallback: Try to fetch items directly
            log.warn("Cart items empty for user {}, trying fallback fetch", userId);
            List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
            if (items.isEmpty()) {
                throw new BusinessException("Cart is empty", "CART_EMPTY");
            }
            cart.setItems(items);
            log.info("Fallback fetch found {} items", items.size());
        }
        
        // 3. Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal nonSaleSubtotal = BigDecimal.ZERO;
        
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            // Check stock again (double check)
            int availableStock = 0;
            if (cartItem.getSize() != null) {
                ProductVariant variant = product.getVariants().stream()
                        .filter(v -> v.getSize().equalsIgnoreCase(cartItem.getSize()))
                        .filter(v -> cartItem.getColor() == null || (v.getColor() != null && v.getColor().equalsIgnoreCase(cartItem.getColor())))
                        .findFirst()
                        .orElseThrow(() -> new BusinessException(
                                String.format("Product variant not found for '%s' (Size: %s). Please remove it from your cart.", 
                                        product.getName(), cartItem.getSize()), 
                                "VARIANT_NOT_FOUND"));
                availableStock = variant.getStock();
            } else {
                 availableStock = product.getTotalStock();
            }
            
            if (cartItem.getQuantity() > availableStock) {
                 throw new BusinessException(
                        String.format("Insufficient stock for product %s. Only %d items available", product.getName(), availableStock),
                        ErrorCodes.INSUFFICIENT_STOCK
                );
            }
            
            BigDecimal actualPrice = product.getPrice();
            if (Boolean.TRUE.equals(product.getIsSale()) && product.getSaleDiscountPercentage() != null) {
                BigDecimal percentage = BigDecimal.valueOf(product.getSaleDiscountPercentage());
                BigDecimal discountAmount = actualPrice.multiply(percentage).divide(BigDecimal.valueOf(100), java.math.RoundingMode.HALF_UP);
                actualPrice = actualPrice.subtract(discountAmount);
            }
            
            BigDecimal itemSubtotal = actualPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .price(actualPrice)
                    .quantity(cartItem.getQuantity())
                    .subtotal(itemSubtotal)
                    .imageUrl(product.getImageUrl())
                    .size(cartItem.getSize())
                    .color(cartItem.getColor())
                    .build();
            
            orderItems.add(orderItem);
            subtotal = subtotal.add(itemSubtotal);
            if (!Boolean.TRUE.equals(product.getIsSale())) {
                nonSaleSubtotal = nonSaleSubtotal.add(itemSubtotal);
            }
        }
        
        // 4. Apply coupon nếu có
        BigDecimal discountAmount = BigDecimal.ZERO;
        String couponCode = null;
        
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findValidCouponByCode(
                request.getCouponCode(), LocalDateTime.now()
            ).orElseThrow(() -> new BusinessException("Invalid or expired coupon", "INVALID_COUPON"));
            
            // Validate min order amount
            if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
                throw new BusinessException(
                    String.format("Minimum order amount is %s VND", coupon.getMinOrderAmount()),
                    "MIN_ORDER_NOT_MET"
                );
            }
            
            // Calculate discount on non-sale subtotal only
            if (nonSaleSubtotal.compareTo(BigDecimal.ZERO) > 0) {
                discountAmount = calculateDiscount(coupon, nonSaleSubtotal);
            } else {
                // Warning or ignore if all items are on sale
                discountAmount = BigDecimal.ZERO;
            }
            couponCode = coupon.getCode();
            
            // Increment coupon usage
            coupon.incrementUsageCount();
            couponRepository.save(coupon);
        }
        
        // 5. Calculate total
        BigDecimal shippingFee = DEFAULT_SHIPPING_FEE;
        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);
        
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }
        
        // 6. Generate order number
        String orderNumber = generateOrderNumber();
        
        // 7. Determine payment status based on method
        PaymentStatus paymentStatus = PaymentStatus.PENDING;
        
        // 8. Create order
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .status(OrderStatus.PENDING)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .couponCode(couponCode)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(paymentStatus)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .shippingDistrict(request.getShippingDistrict())
                .note(request.getNote())
                .build();
        
        // 9. Add order items to order
        for (OrderItem item : orderItems) {
            order.addOrderItem(item);
        }
        
        // 10. Save order
        Order savedOrder = orderRepository.save(order);
        
        // 11. Deduct stock (atomic — tránh race condition)
        for (OrderItem item : savedOrder.getOrderItems()) {
            if (item.getSize() != null) {
                // Dùng atomic UPDATE để deduct stock, chỉ thành công nếu stock >= qty
                ProductVariant lockedVariant = productVariantRepository
                        .findByProductIdAndSizeAndColorWithLock(
                                item.getProduct().getId(), item.getSize(), item.getColor())
                        .orElseThrow(() -> new BusinessException(
                                String.format("Variant not found for stock deduction: %s (Size: %s)",
                                        item.getProductName(), item.getSize()),
                                "VARIANT_NOT_FOUND"));

                int updated = productVariantRepository.decrementStock(lockedVariant.getId(), item.getQuantity());
                if (updated == 0) {
                    // Stock không đủ (đã bị deduct bởi request khác trước đó)
                    throw new BusinessException(
                            String.format("Insufficient stock for '%s' (Size: %s). Stock may have changed during checkout.",
                                    item.getProductName(), item.getSize()),
                            ErrorCodes.INSUFFICIENT_STOCK);
                }
            } else {
                // Fallback: deduct từ variant đầu tiên
                Product product = item.getProduct();
                if (!product.getVariants().isEmpty()) {
                    productVariantRepository.decrementStock(
                            product.getVariants().get(0).getId(), item.getQuantity());
                }
            }
        }
        
        // 12. Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);
        
        log.info("Order created successfully: {}", savedOrder.getOrderNumber());
        
        // Send email
        try {
            emailService.sendOrderConfirmation(savedOrder);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email", e);
        }
        
        return orderMapper.toResponse(savedOrder);
    }
    
    /**
     * Lấy orders của user
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        log.info("Fetching orders for user {}", userId);
        
        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        
        return orders.map(orderMapper::toResponse);
    }
    
    /**
     * Lấy chi tiết order (User)
     */
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Long userId) {
        log.info("Fetching order {} for user {}", orderId, userId);
        
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        // Check ownership
        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only view your own orders");
        }
        
        return orderMapper.toResponse(order);
    }
    
    /**
     * Hủy order (User)
     */
    @Override
    @Transactional
    public void cancelOrder(Long orderId, Long userId, CancelOrderRequest request) {
        log.info("User {} cancelling order {}", userId, orderId);
        
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        // Check ownership
        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only cancel your own orders");
        }
        
        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
             throw new BusinessException("Cannot cancel completed or already cancelled order", "INVALID_STATUS");
        }
        
        // Restore stock
        restoreStockForOrder(order);
        
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        orderRepository.saveAndFlush(order);
        log.info("Order {} cancelled successfully", orderId);
        
        try {
            emailService.sendOrderStatusUpdate(order);
        } catch (Exception e) {
            log.error("Failed to send cancellation email", e);
        }
    }
    
    /**
     * Lấy tất cả orders (Admin)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        log.info("Fetching all orders (Admin)");
        
        Page<Order> orders = orderRepository.findAll(pageable);
        
        return orders.map(orderMapper::toResponse);
    }
    
    /**
     * Lấy chi tiết order (Admin)
     */
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdAdmin(Long orderId) {
        log.info("Admin fetching order {}", orderId);
        
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        return orderMapper.toResponse(order);
    }
    
    /**
     * Update order status (Admin)
     */
    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        log.info("Admin updating order {} status to {}", orderId, request.getStatus());
        
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();
        
        // Validate status transition
        validateStatusTransition(oldStatus, newStatus);
        
        // Update status
        order.setStatus(newStatus);
        
        // Set completed/cancelled timestamps
        if (newStatus == OrderStatus.DELIVERED) {
            order.setCompletedAt(LocalDateTime.now());
            order.setPaymentStatus(PaymentStatus.PAID);
        } else if (newStatus == OrderStatus.CANCELLED) {
            order.setCancelledAt(LocalDateTime.now());
            
            // Restore stock for admin cancellation
            restoreStockForOrder(order);
        }
        
        Order updatedOrder = orderRepository.saveAndFlush(order);
        
        try {
            emailService.sendOrderStatusUpdate(updatedOrder);
        } catch (Exception e) {
            log.error("Failed to send status update email", e);
        }
        
        return orderMapper.toResponse(updatedOrder);
    }
    
    /**
     * Search orders (Admin)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> searchOrders(String keyword, Pageable pageable) {
        log.info("Searching orders with keyword: {}", keyword);
        
        Page<Order> orders = orderRepository.searchOrders(keyword, pageable);
        
        return orders.map(orderMapper::toResponse);
    }
    
    /**
     * Update order status after payment
     */
    @Override
    @Transactional
    public void updateOrderAfterPayment(Long orderId, boolean success) {
        log.info("Updating order {} after payment. Success: {}", orderId, success);
        
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        if (success) {
            if (order.getStatus() == OrderStatus.PENDING) {
                order.setStatus(OrderStatus.CONFIRMED);
                order.setPaymentStatus(PaymentStatus.PAID);
                orderRepository.saveAndFlush(order);
                log.info("Order {} confirmed and paid", orderId);
                
                try {
                    emailService.sendOrderStatusUpdate(order);
                } catch (Exception e) {
                    log.error("Failed to send payment confirmation email", e);
                }
            }
        } else {
            // Payment failed -> Delete order and restore stock/cart
            if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.DELIVERED) {
                log.info("Order {} payment failed. Restoring stock and cart, then deleting order.", orderId);
                
                // Restore stock
                restoreStockForOrder(order);
                
                // Restore cart
                restoreCartForOrder(order);
                
                // Hard delete order so it doesn't pollute order history
                orderRepository.delete(order);
                log.info("Order {} deleted due to payment failure", orderId);
                
                // NOTE: Not sending cancellation email because order is deleted
            }
        }
    }
    
    // ============== PRIVATE HELPER METHODS ==============
    
    /**
     * Calculate discount từ coupon
     */
    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal amount) {
        BigDecimal discount;
        
        if (coupon.getDiscountType().toString().equals("PERCENTAGE")) {
            discount = amount.multiply(coupon.getDiscountValue())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else {
            discount = coupon.getDiscountValue();
            if (discount.compareTo(amount) > 0) {
                discount = amount;
            }
        }
        
        return discount.setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Restore stock cho tất cả OrderItems khi order bị cancel.
     * Dùng atomic incrementStock để tránh data inconsistency.
     */
    private void restoreStockForOrder(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            if (item.getSize() != null) {
                productVariantRepository
                        .findByProductIdAndSizeAndColorWithLock(
                                item.getProduct().getId(), item.getSize(), item.getColor())
                        .ifPresent(v -> productVariantRepository.incrementStock(v.getId(), item.getQuantity()));
            } else {
                Product product = item.getProduct();
                if (!product.getVariants().isEmpty()) {
                    productVariantRepository.incrementStock(
                            product.getVariants().get(0).getId(), item.getQuantity());
                }
            }
        }
    }

    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int random = java.util.concurrent.ThreadLocalRandom.current().nextInt(1000, 9999);
        return String.format("ORD-%s-%d", date, random);
    }
    
    /**
     * Validate status transition
     */
    private void validateStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {
        // Business rules for status transitions
        if (oldStatus == OrderStatus.CANCELLED || oldStatus == OrderStatus.DELIVERED) {
            throw new BusinessException("Cannot change status of completed/cancelled order", "INVALID_STATUS_TRANSITION");
        }
        
        // Add more validation rules as needed
    }
    
    /**
     * Restore cart items when payment fails and order is deleted
     */
    private void restoreCartForOrder(Order order) {
        Long userId = order.getUser().getId();
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(order.getUser()).build();
                    return cartRepository.save(newCart);
                });

        List<CartItem> currentItems = cart.getItems();

        for (OrderItem orderItem : order.getOrderItems()) {
            boolean exists = false;
            for (CartItem cartItem : currentItems) {
                if (cartItem.getProduct().getId().equals(orderItem.getProduct().getId()) &&
                    java.util.Objects.equals(cartItem.getSize(), orderItem.getSize()) &&
                    java.util.Objects.equals(cartItem.getColor(), orderItem.getColor())) {
                    
                    cartItem.setQuantity(cartItem.getQuantity() + orderItem.getQuantity());
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                CartItem newItem = CartItem.builder()
                        .cart(cart)
                        .product(orderItem.getProduct())
                        .quantity(orderItem.getQuantity())
                        .size(orderItem.getSize())
                        .color(orderItem.getColor())
                        .build();
                cart.addItem(newItem);
            }
        }
        cartRepository.save(cart);
    }
}
