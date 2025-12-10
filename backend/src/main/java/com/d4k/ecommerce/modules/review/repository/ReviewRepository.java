package com.d4k.ecommerce.modules.review.repository;

import com.d4k.ecommerce.modules.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Review Repository
 * Data access layer cho Review entity
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    /**
     * Tìm reviews của một product
     */
    Page<Review> findByProductId(Long productId, Pageable pageable);
    
    /**
     * Tìm reviews của một user
     */
    Page<Review> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Tìm review theo user và product
     */
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    
    /**
     * Kiểm tra user đã review product chưa
     */
    Boolean existsByUserIdAndProductId(Long userId, Long productId);
    
    /**
     * Tính rating trung bình của product
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);
    
    /**
     * Đếm số lượng reviews của product
     */
    /**
     * Đếm số lượng reviews của product
     */
    Long countByProductId(Long productId);

    /**
     * Lấy review mới nhất của user (để check rate limit)
     */
    Optional<Review> findTopByUserIdOrderByCreatedAtDesc(Long userId);
}

