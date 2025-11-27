package com.d4k.ecommerce.modules.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO request cho hủy order
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancelOrderRequest {
    
    @NotBlank(message = "Cancel reason is required")
    @Size(max = 500, message = "Cancel reason must not exceed 500 characters")
    private String cancelReason;
}

