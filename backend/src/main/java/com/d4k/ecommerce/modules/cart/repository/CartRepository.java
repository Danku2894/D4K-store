package com.d4k.ecommerce.modules.cart.repository;

import com.d4k.ecommerce.modules.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Cart Repository
 * Data access layer cho Cart entity
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    /**
     * Tìm cart theo user ID
     */
    Optional<Cart> findByUserId(Long userId);
    
    /**
     * Tìm cart theo user ID với eager loading items
     */
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.user.id = :userId")
    Optional<Cart> findByUserIdWithItems(@Param("userId") Long userId);
    
    /**
     * Kiểm tra user đã có cart chưa
     */
    Boolean existsByUserId(Long userId);
}

