package com.d4k.ecommerce.modules.payment.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    
    private final PaymentService paymentService;
    private final com.d4k.ecommerce.modules.order.service.OrderService orderService;

    @GetMapping("/vn-pay")
    public ResponseEntity<ApiResponse<String>> createPaymentUrl(
            @RequestParam(required = false) Long orderId,
            @RequestParam long amount,
            @RequestParam(defaultValue = "Thanh toan don hang") String orderInfo,
            HttpServletRequest request
    ) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        // Handle logic if user passes amount directly
        String paymentUrl = paymentService.createPaymentUrl(orderId, amount, orderInfo, baseUrl);
        return ResponseEntity.ok(ApiResponse.success(paymentUrl, "Payment URL created successfully"));
    }

    @GetMapping("/vn-pay-return")
    public ResponseEntity<ApiResponse<Object>> handleVnPayReturn(HttpServletRequest request) {
        // Handle return logic (verify checksum)
        // For now, we will just return the params as success
        // In real app, we check vnp_ResponseCode
        String responseCode = request.getParameter("vnp_ResponseCode");
        String txnRef = request.getParameter("vnp_TxnRef");
        
        try {
            Long orderId = Long.parseLong(txnRef);
            
            if ("00".equals(responseCode)) {
                 // Payment successful
                 orderService.updateOrderAfterPayment(orderId, true);
                 return ResponseEntity.ok(ApiResponse.success(null, "Payment successful"));
            } else {
                 // Payment failed
                 orderService.updateOrderAfterPayment(orderId, false);
                 return ResponseEntity.badRequest().body(ApiResponse.error("Payment failed", "VNPAY Response Code: " + responseCode));
            }
        } catch (NumberFormatException e) {
            log.error("Invalid order ID in VNPAY return: {}", txnRef);
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid Order ID", e.getMessage()));
        }
    }
}
