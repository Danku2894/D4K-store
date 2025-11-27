package com.d4k.ecommerce.modules.review.entity;

import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Review Entity
 * Đánh giá sản phẩm từ khách hàng
 */
@Entity
@Table(name = "reviews", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_product_review", columnNames = {"user_id", "product_id"})
    },
    indexes = {
        @Index(name = "idx_review_product", columnList = "product_id"),
        @Index(name = "idx_review_user", columnList = "user_id"),
        @Index(name = "idx_review_rating", columnList = "rating")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Reference to User
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * Reference to Product
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    /**
     * Rating: 1-5 stars
     */
    @Column(name = "rating", nullable = false)
    private Integer rating;
    
    /**
     * Comment/Review text
     */
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

