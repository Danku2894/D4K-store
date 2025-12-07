package com.d4k.ecommerce.modules.order.mapper;

import com.d4k.ecommerce.modules.order.dto.response.OrderItemResponse;
import com.d4k.ecommerce.modules.order.dto.response.OrderResponse;
import com.d4k.ecommerce.modules.order.entity.Order;
import com.d4k.ecommerce.modules.order.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Order Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class OrderMapper {
    
    /**
     * Convert Order entity sang OrderResponse
     */
    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }
        
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getFullName() : null)
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .couponCode(order.getCouponCode())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .shippingDistrict(order.getShippingDistrict())
                .note(order.getNote())
                .orderItems(order.getOrderItems() != null ? 
                    order.getOrderItems().stream()
                        .map(this::toOrderItemResponse)
                        .collect(Collectors.toList()) : null)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .completedAt(order.getCompletedAt())
                .cancelledAt(order.getCancelledAt())
                .cancelReason(order.getCancelReason())
                .build();
    }
    
    /**
     * Convert OrderItem entity sang OrderItemResponse
     */
    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        if (item == null) {
            return null;
        }
        
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .size(item.getSize())
                .color(item.getColor())
                .imageUrl(item.getImageUrl())
                .build();
    }
    
    /**
     * Convert list Orders to list OrderResponses
     */
    public List<OrderResponse> toResponseList(List<Order> orders) {
        if (orders == null) {
            return null;
        }
        
        return orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
