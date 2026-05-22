package com.d4k.ecommerce.modules.payment.controller;

import com.d4k.ecommerce.common.config.VnPayConfig;
import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.payment.service.PaymentService;
import com.d4k.ecommerce.modules.payment.service.impl.VnPayService;
import com.d4k.ecommerce.modules.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final VnPayConfig vnPayConfig;

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
        String responseCode = request.getParameter("vnp_ResponseCode");
        String txnRef = request.getParameter("vnp_TxnRef");
        String receivedHash = request.getParameter("vnp_SecureHash");

        // ✅ BƯỚC 1: Verify HMAC SHA512 trước khi xử lý bất cứ điều gì
        if (!verifyVnPaySignature(request, receivedHash)) {
            log.warn("VNPay HMAC verification FAILED for txnRef={}", txnRef);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid signature", "INVALID_SIGNATURE"));
        }

        try {
            Long orderId = Long.parseLong(txnRef);

            if ("00".equals(responseCode)) {
                // Payment successful
                orderService.updateOrderAfterPayment(orderId, true);
                log.info("VNPay payment successful for order {}", orderId);
                return ResponseEntity.ok(ApiResponse.success(null, "Payment successful"));
            } else {
                // Payment failed
                orderService.updateOrderAfterPayment(orderId, false);
                log.info("VNPay payment failed for order {}, responseCode={}", orderId, responseCode);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Payment failed", "VNPAY Response Code: " + responseCode));
            }
        } catch (NumberFormatException e) {
            log.error("Invalid order ID in VNPAY return: {}", txnRef);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid Order ID", e.getMessage()));
        }
    }

    /**
     * Verify chữ ký HMAC SHA512 từ VNPay.
     * Rebuild hash data từ tất cả params (trừ vnp_SecureHash và vnp_SecureHashType),
     * sort theo alphabet, rồi so sánh với receivedHash.
     */
    private boolean verifyVnPaySignature(HttpServletRequest request, String receivedHash) {
        if (receivedHash == null || receivedHash.isBlank()) {
            return false;
        }
        try {
            // Lấy tất cả params, bỏ qua vnp_SecureHash và vnp_SecureHashType
            Map<String, String> sortedParams = new TreeMap<>();
            Enumeration<String> paramNames = request.getParameterNames();
            while (paramNames.hasMoreElements()) {
                String name = paramNames.nextElement();
                if (!name.equals("vnp_SecureHash") && !name.equals("vnp_SecureHashType")) {
                    sortedParams.put(name, request.getParameter(name));
                }
            }

            // Build chuỗi hash data (key=URLEncode(value)&...)
            StringBuilder hashData = new StringBuilder();
            Iterator<Map.Entry<String, String>> itr = sortedParams.entrySet().iterator();
            while (itr.hasNext()) {
                Map.Entry<String, String> entry = itr.next();
                String value = entry.getValue();
                if (value != null && !value.isEmpty()) {
                    hashData.append(entry.getKey())
                            .append('=')
                            .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) hashData.append('&');
                }
            }

            // Compute HMAC và so sánh (case-insensitive)
            String computedHash = VnPayService.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
            return receivedHash.equalsIgnoreCase(computedHash);

        } catch (Exception e) {
            log.error("Error verifying VNPay signature", e);
            return false;
        }
    }
}
