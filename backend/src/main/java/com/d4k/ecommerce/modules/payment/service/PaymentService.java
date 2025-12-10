package com.d4k.ecommerce.modules.payment.service;

import com.d4k.ecommerce.modules.order.dto.response.OrderResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    String createPaymentUrl(long orderTotal, String orderInfo, String baseUrl);
    String createPaymentUrl(Long orderId, long orderTotal, String orderInfo, String baseUrl);
    OrderResponse handleIpn(HttpServletRequest request);
}
