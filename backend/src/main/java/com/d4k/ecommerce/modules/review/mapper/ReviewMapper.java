package com.d4k.ecommerce.modules.review.mapper;

import com.d4k.ecommerce.modules.review.dto.response.ReviewResponse;
import com.d4k.ecommerce.modules.review.entity.Review;
import org.springframework.stereotype.Component;

/**
 * Review Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class ReviewMapper {
    
    /**
     * Convert Review entity sang ReviewResponse
     */
    public ReviewResponse toResponse(Review review) {
        if (review == null) {
            return null;
        }
        
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .userName(review.getUser() != null ? review.getUser().getFullName() : null)
                .productId(review.getProduct() != null ? review.getProduct().getId() : null)
                .productName(review.getProduct() != null ? review.getProduct().getName() : null)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

