package com.d4k.ecommerce.modules.order.dto.request;

import com.d4k.ecommerce.modules.order.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO request cho tạo order
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    
    /**
     * Mã coupon (optional)
     */
    @Size(max = 50, message = "Coupon code must not exceed 50 characters")
    private String couponCode;
    
    /**
     * Phương thức thanh toán
     */
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    /**
     * Thông tin người nhận
     */
    @NotBlank(message = "Receiver name is required")
    @Size(max = 100, message = "Receiver name must not exceed 100 characters")
    private String receiverName;
    
    @NotBlank(message = "Receiver phone is required")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
    private String receiverPhone;
    
    /**
     * Địa chỉ giao hàng
     */
    @NotBlank(message = "Shipping address is required")
    @Size(max = 500, message = "Shipping address must not exceed 500 characters")
    private String shippingAddress;
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String shippingCity;
    
    @Size(max = 100, message = "District must not exceed 100 characters")
    private String shippingDistrict;
    
    /**
     * Ghi chú
     */
    @Size(max = 1000, message = "Note must not exceed 1000 characters")
    private String note;
}
