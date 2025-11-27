package com.d4k.ecommerce.modules.order.enums;

/**
 * Payment Method Enum
 * Phương thức thanh toán
 */
public enum PaymentMethod {
    /**
     * Thanh toán khi nhận hàng
     */
    COD,
    
    /**
     * Chuyển khoản ngân hàng
     */
    BANK_TRANSFER,
    
    /**
     * VNPay (Cổng thanh toán VN)
     */
    VNPAY,
    
    /**
     * MoMo (Ví điện tử)
     */
    MOMO,
    
    /**
     * Thẻ tín dụng/ghi nợ
     */
    CREDIT_CARD
}
