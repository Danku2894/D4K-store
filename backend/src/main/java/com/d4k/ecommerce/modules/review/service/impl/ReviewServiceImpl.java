package com.d4k.ecommerce.modules.review.service.impl;

import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.common.exception.UnauthorizedException;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.repository.ProductRepository;
import com.d4k.ecommerce.modules.review.dto.request.ReviewRequest;
import com.d4k.ecommerce.modules.review.dto.response.ReviewResponse;
import com.d4k.ecommerce.modules.review.entity.Review;
import com.d4k.ecommerce.modules.review.mapper.ReviewMapper;
import com.d4k.ecommerce.modules.review.repository.ReviewRepository;
import com.d4k.ecommerce.modules.review.service.ReviewService;
import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Review Service Implementation
 * Xử lý business logic cho reviews
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.d4k.ecommerce.modules.order.repository.OrderRepository orderRepository;
    private final ReviewMapper reviewMapper;
    
    /**
     * Tạo review mới
     */
    @Override
    @Transactional
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        log.info("User {} creating review for product {}", userId, request.getProductId());
        
        // Validate user tồn tại
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        // Validate product tồn tại
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));
        
        // Kiểm tra user đã review product này chưa
        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            log.error("User {} already reviewed product {}", userId, request.getProductId());
            throw new BusinessException("You have already reviewed this product", "REVIEW_ALREADY_EXISTS");
        }
        
        // Validate user đã mua sản phẩm này chưa
        boolean hasPurchased = orderRepository.existsByUserIdAndProductIdAndDelivered(userId, request.getProductId());
        if (!hasPurchased) {
            throw new BusinessException(
                "You must purchase this product before reviewing", 
                "PURCHASE_REQUIRED"
            );
        }
        
        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BusinessException("Rating must be between 1 and 5", "INVALID_RATING");
        }
        
        // Tạo review
        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        
        Review savedReview = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}", savedReview.getId());
        
        return reviewMapper.toResponse(savedReview);
    }
    
    /**
     * Lấy reviews của product
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        log.info("Fetching reviews for product {}", productId);
        
        // Validate product tồn tại
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
        
        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
        
        return reviews.map(reviewMapper::toResponse);
    }
    
    /**
     * Lấy reviews của user
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getUserReviews(Long userId, Pageable pageable) {
        log.info("Fetching reviews by user {}", userId);
        
        Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
        
        return reviews.map(reviewMapper::toResponse);
    }
    
    /**
     * Xóa review (User - chỉ xóa review của mình)
     */
    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        log.info("User {} deleting review {}", userId, reviewId);
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        
        // Kiểm tra review có thuộc về user không
        if (!review.getUser().getId().equals(userId)) {
            log.error("User {} is not the owner of review {}", userId, reviewId);
            throw new UnauthorizedException("You can only delete your own reviews");
        }
        
        reviewRepository.deleteById(reviewId);
        log.info("Review {} deleted successfully", reviewId);
    }
    
    /**
     * Admin xóa review (có thể xóa bất kỳ review nào)
     */
    @Override
    @Transactional
    public void deleteReviewByAdmin(Long reviewId) {
        log.info("Admin deleting review {}", reviewId);
        
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review", "id", reviewId);
        }
        
        reviewRepository.deleteById(reviewId);
        log.info("Review {} deleted by admin", reviewId);
    }
    
    /**
     * Lấy rating trung bình
     */
    @Override
    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        return avgRating != null ? avgRating : 0.0;
    }
    
    /**
     * Lấy số lượng reviews
     */
    @Override
    @Transactional(readOnly = true)
    public Long getReviewCount(Long productId) {
        return reviewRepository.countByProductId(productId);
    }
}

