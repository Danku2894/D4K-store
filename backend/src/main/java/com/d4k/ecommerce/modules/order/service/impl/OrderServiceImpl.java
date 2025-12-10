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
    private final CouponRepository couponRepository;
    private final OrderMapper orderMapper;
    private final EmailService emailService;
    
    private static final BigDecimal DEFAULT_SHIPPING_FEE = new BigDecimal("30000.00");
    // private static final AtomicLong orderCounter = new AtomicLong(1); // Removed in favor of DB check
    
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
            
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .subtotal(itemSubtotal)
                    .imageUrl(product.getImageUrl())
                    .size(cartItem.getSize())
                    .color(cartItem.getColor())
                    .build();
            
            orderItems.add(orderItem);
            subtotal = subtotal.add(itemSubtotal);
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
            
            // Calculate discount
            discountAmount = calculateDiscount(coupon, subtotal);
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
        
        // 11. Deduct stock
        for (OrderItem item : savedOrder.getOrderItems()) {
            Product product = item.getProduct();
            if (item.getSize() != null) {
                ProductVariant variant = product.getVariants().stream()
                    .filter(v -> v.getSize().equalsIgnoreCase(item.getSize()))
                    .filter(v -> item.getColor() == null || (v.getColor() != null && v.getColor().equalsIgnoreCase(item.getColor())))
                    .findFirst()
                    .orElseThrow(() -> new BusinessException(
                            String.format("Variant not found for stock deduction: %s (Size: %s)", 
                                    product.getName(), item.getSize()), 
                            "VARIANT_NOT_FOUND"));
                
                variant.setStock(variant.getStock() - item.getQuantity());
            } else {
                 // Fallback
                 if (!product.getVariants().isEmpty()) {
                      ProductVariant variant = product.getVariants().get(0);
                      variant.setStock(variant.getStock() - item.getQuantity());
                 }
            }
            productRepository.save(product);
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
        
        Order order = orderRepository.findById(orderId)
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
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        // Check ownership
        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only cancel your own orders");
        }
        
        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
             throw new BusinessException("Cannot cancel completed or already cancelled order", "INVALID_STATUS");
        }
        
        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (item.getSize() != null) {
                ProductVariant variant = product.getVariants().stream()
                    .filter(v -> v.getSize().equalsIgnoreCase(item.getSize()))
                    .filter(v -> item.getColor() == null || (v.getColor() != null && v.getColor().equalsIgnoreCase(item.getColor())))
                    .findFirst()
                    .orElse(null);
                
                if (variant != null) {
                    variant.setStock(variant.getStock() + item.getQuantity());
                }
            } else {
                 if (!product.getVariants().isEmpty()) {
                      ProductVariant variant = product.getVariants().get(0);
                      variant.setStock(variant.getStock() + item.getQuantity());
                 }
            }
            productRepository.save(product);
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        orderRepository.save(order);
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
        
        Order order = orderRepository.findById(orderId)
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
        
        Order order = orderRepository.findById(orderId)
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
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (item.getSize() != null) {
                    ProductVariant variant = product.getVariants().stream()
                        .filter(v -> v.getSize().equalsIgnoreCase(item.getSize()))
                        .findFirst()
                        .orElse(null);
                    if (variant != null) {
                        variant.setStock(variant.getStock() + item.getQuantity());
                    }
                } else {
                     if (!product.getVariants().isEmpty()) {
                          ProductVariant variant = product.getVariants().get(0);
                          variant.setStock(variant.getStock() + item.getQuantity());
                     }
                }
                productRepository.save(product);
            }
        }
        
        Order updatedOrder = orderRepository.save(order);
        
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
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        if (success) {
            if (order.getStatus() == OrderStatus.PENDING) {
                order.setStatus(OrderStatus.CONFIRMED);
                order.setPaymentStatus(PaymentStatus.PAID);
                orderRepository.save(order);
                log.info("Order {} confirmed and paid", orderId);
                
                try {
                    emailService.sendOrderStatusUpdate(order);
                } catch (Exception e) {
                    log.error("Failed to send payment confirmation email", e);
                }
            }
        } else {
            // Payment failed -> Cancel order and restore stock
            if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.DELIVERED) {
                order.setStatus(OrderStatus.CANCELLED);
                order.setPaymentStatus(PaymentStatus.FAILED);
                order.setCancelledAt(LocalDateTime.now());
                order.setCancelReason("Payment Failed / Cancelled by User");
                
                // Restore stock
                for (OrderItem item : order.getOrderItems()) {
                    Product product = item.getProduct();
                    if (item.getSize() != null) {
                        ProductVariant variant = product.getVariants().stream()
                            .filter(v -> v.getSize().equalsIgnoreCase(item.getSize()))
                            .filter(v -> item.getColor() == null || (v.getColor() != null && v.getColor().equalsIgnoreCase(item.getColor())))
                            .findFirst()
                            .orElse(null);
                        
                        if (variant != null) {
                            variant.setStock(variant.getStock() + item.getQuantity());
                        }
                    } else {
                         if (!product.getVariants().isEmpty()) {
                              ProductVariant variant = product.getVariants().get(0);
                              variant.setStock(variant.getStock() + item.getQuantity());
                         }
                    }
                    productRepository.save(product);
                }
                
                orderRepository.save(order);
                log.info("Order {} cancelled due to payment failure", orderId);
                
                try {
                    emailService.sendOrderStatusUpdate(order);
                } catch (Exception e) {
                    log.error("Failed to send payment failure email", e);
                }
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
     * Generate unique order number
     */
    /**
     * Generate unique order number
     */
    private synchronized String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = String.format("ORD-%s-", date);
        
        // Find the latest order number for today
        return orderRepository.findTopByOrderNumberStartingWithOrderByOrderNumberDesc(prefix)
                .map(order -> {
                    String currentOrderNumber = order.getOrderNumber();
                    // Extract sequence number (last 5 digits)
                    String sequenceStr = currentOrderNumber.substring(currentOrderNumber.length() - 5);
                    long sequence = Long.parseLong(sequenceStr);
                    return String.format("%s%05d", prefix, sequence + 1);
                })
                .orElse(String.format("%s%05d", prefix, 1));
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
}
