package com.d4k.ecommerce.modules.wishlist.repository;

import com.d4k.ecommerce.modules.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Wishlist Repository
 * Data access layer cho Wishlist entity
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    /**
     * Tìm wishlist theo user ID
     */
    Optional<Wishlist> findByUserId(Long userId);
    
    /**
     * Tìm wishlist theo user ID với eager loading items
     */
    @Query("SELECT w FROM Wishlist w LEFT JOIN FETCH w.items WHERE w.user.id = :userId")
    Optional<Wishlist> findByUserIdWithItems(@Param("userId") Long userId);
    
    /**
     * Kiểm tra user đã có wishlist chưa
     */
    Boolean existsByUserId(Long userId);
}

