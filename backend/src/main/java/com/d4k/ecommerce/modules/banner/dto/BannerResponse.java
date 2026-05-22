package com.d4k.ecommerce.modules.banner.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class BannerResponse {
    private Long id;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
