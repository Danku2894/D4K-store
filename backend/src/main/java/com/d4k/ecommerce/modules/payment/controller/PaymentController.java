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
        if ("00".equals(responseCode)) {
             // Payment successful
             // TODO: Update order status logic here or in Service
             return ResponseEntity.ok(ApiResponse.success(null, "Payment successful"));
        } else {
             return ResponseEntity.badRequest().body(ApiResponse.error("Payment failed", "VNPAY Response Code: " + responseCode));
        }
    }
}
