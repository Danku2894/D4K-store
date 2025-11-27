package com.d4k.ecommerce.modules.order.dto.request;

import com.d4k.ecommerce.modules.order.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO request cho cập nhật trạng thái order
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {
    
    @NotNull(message = "Status is required")
    private OrderStatus status;
    
    private String note;
}
