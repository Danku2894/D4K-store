package com.d4k.ecommerce.modules.order.dto.response;

import com.d4k.ecommerce.modules.order.enums.OrderStatus;
import com.d4k.ecommerce.modules.order.enums.PaymentMethod;
import com.d4k.ecommerce.modules.order.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO response cho order
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    
    private Long id;
    
    private String orderNumber;
    
    private Long userId;
    
    private String userName;
    
    private OrderStatus status;
    
    private BigDecimal subtotal;
    
    private BigDecimal shippingFee;
    
    private BigDecimal discountAmount;
    
    private String couponCode;
    
    private BigDecimal totalAmount;
    
    private PaymentMethod paymentMethod;
    
    private PaymentStatus paymentStatus;
    
    private String receiverName;
    
    private String receiverPhone;
    
    private String shippingAddress;
    
    private String shippingCity;
    
    private String shippingDistrict;
    
    private String note;
    
    private List<OrderItemResponse> orderItems;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
    
    private LocalDateTime cancelledAt;
    
    private String cancelReason;
}
