package com.d4k.ecommerce.modules.order.enums;

/**
 * Order Status Enum
 * Trạng thái của đơn hàng
 */
public enum OrderStatus {
    /**
     * Đơn hàng mới tạo, chờ xác nhận
     */
    PENDING,
    
    /**
     * Đã xác nhận, chờ xử lý
     */
    CONFIRMED,
    
    /**
     * Đang chuẩn bị hàng
     */
    PROCESSING,
    
    /**
     * Đang giao hàng
     */
    SHIPPING,
    
    /**
     * Đã giao thành công
     */
    DELIVERED,
    
    /**
     * Đã hủy
     */
    CANCELLED,
    
    /**
     * Đã hoàn trả
     */
    RETURNED
}
