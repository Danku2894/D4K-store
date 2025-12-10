package com.d4k.ecommerce.common.service;

import com.d4k.ecommerce.modules.order.entity.Order;

/**
 * Email Service Interface
 */
public interface EmailService {
    
    /**
     * Send generic email
     */
    void sendEmail(String to, String subject, String body);

    /**
     * Send email when order is placed successfully
     */
    void sendOrderConfirmation(Order order);
    
    /**
     * Send email when order status is updated
     */
    void sendOrderStatusUpdate(Order order);
}
