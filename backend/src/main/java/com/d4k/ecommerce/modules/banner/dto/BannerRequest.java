package com.d4k.ecommerce.modules.banner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BannerRequest {
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
}
