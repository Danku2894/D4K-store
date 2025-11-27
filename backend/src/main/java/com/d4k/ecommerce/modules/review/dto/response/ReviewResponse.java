package com.d4k.ecommerce.modules.review.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO response cho review
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    
    private Long id;
    
    private Long userId;
    
    private String userName;
    
    private Long productId;
    
    private String productName;
    
    private Integer rating;
    
    private String comment;
    
    private LocalDateTime createdAt;
}

