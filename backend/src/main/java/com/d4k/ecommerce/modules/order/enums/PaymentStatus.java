package com.d4k.ecommerce.modules.order.enums;

/**
 * Payment Status Enum
 * Trạng thái thanh toán
 */
public enum PaymentStatus {
    /**
     * Chờ thanh toán
     */
    PENDING,
    
    /**
     * Đã thanh toán thành công
     */
    PAID,
    
    /**
     * Thanh toán thất bại
     */
    FAILED,
    
    /**
     * Đã hoàn tiền
     */
    REFUNDED
}

