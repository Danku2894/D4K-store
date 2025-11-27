package com.d4k.ecommerce.modules.review.service;

import com.d4k.ecommerce.modules.review.dto.request.ReviewRequest;
import com.d4k.ecommerce.modules.review.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Review Service Interface
 * Định nghĩa business logic cho reviews
 */
public interface ReviewService {
    
    /**
     * Tạo review mới
     * @param userId user ID
     * @param request thông tin review
     * @return review đã tạo
     */
    ReviewResponse createReview(Long userId, ReviewRequest request);
    
    /**
     * Lấy danh sách reviews của một product
     * @param productId product ID
     * @param pageable thông tin phân trang
     * @return danh sách reviews
     */
    Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable);
    
    /**
     * Lấy reviews của user
     * @param userId user ID
     * @param pageable thông tin phân trang
     * @return danh sách reviews
     */
    Page<ReviewResponse> getUserReviews(Long userId, Pageable pageable);
    
    /**
     * Xóa review
     * @param reviewId review ID
     * @param userId user ID (để check ownership)
     */
    void deleteReview(Long reviewId, Long userId);
    
    /**
     * Admin xóa review
     * @param reviewId review ID
     */
    void deleteReviewByAdmin(Long reviewId);
    
    /**
     * Lấy rating trung bình của product
     * @param productId product ID
     * @return average rating
     */
    Double getAverageRating(Long productId);
    
    /**
     * Lấy số lượng reviews của product
     * @param productId product ID
     * @return review count
     */
    Long getReviewCount(Long productId);
}

