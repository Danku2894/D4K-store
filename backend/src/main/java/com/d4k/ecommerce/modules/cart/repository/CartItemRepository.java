package com.d4k.ecommerce.modules.cart.repository;

import com.d4k.ecommerce.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CartItem Repository
 * Data access layer cho CartItem entity
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    /**
     * Tìm cart item theo cart ID và product ID
     */
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.product.id = :productId AND " +
           "((ci.size IS NULL AND :size IS NULL) OR ci.size = :size) AND " +
           "((ci.color IS NULL AND :color IS NULL) OR ci.color = :color)")
    Optional<CartItem> findExactCartItem(
            @Param("cartId") Long cartId, 
            @Param("productId") Long productId, 
            @Param("size") String size, 
            @Param("color") String color);
    
    /**
     * Tìm cart item với eager loading product
     */
    @Query("SELECT ci FROM CartItem ci JOIN FETCH ci.product WHERE ci.id = :itemId")
    Optional<CartItem> findByIdWithProduct(@Param("itemId") Long itemId);
    
    /**
     * Kiểm tra cart item có tồn tại trong cart của user không
     */
    @Query("SELECT CASE WHEN COUNT(ci) > 0 THEN true ELSE false END " +
           "FROM CartItem ci WHERE ci.id = :itemId AND ci.cart.user.id = :userId")
    Boolean existsByIdAndUserId(@Param("itemId") Long itemId, @Param("userId") Long userId);

    List<CartItem> findByCartId(Long cartId);
}

