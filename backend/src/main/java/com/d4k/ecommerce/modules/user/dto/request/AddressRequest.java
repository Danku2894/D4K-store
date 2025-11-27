package com.d4k.ecommerce.modules.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO request cho thêm/sửa address
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    
    @NotBlank(message = "Receiver name is required")
    @Size(max = 100, message = "Receiver name must not exceed 100 characters")
    private String receiverName;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone must be 10-11 digits")
    private String phone;
    
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @Size(max = 100, message = "Ward must not exceed 100 characters")
    private String ward;
    
    @Size(max = 100, message = "District must not exceed 100 characters")
    private String district;
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @Builder.Default
    private Boolean isDefault = false;
}

