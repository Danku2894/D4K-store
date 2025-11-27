package com.d4k.ecommerce.modules.wishlist.repository;

import com.d4k.ecommerce.modules.wishlist.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * WishlistItem Repository
 * Data access layer cho WishlistItem entity
 */
@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    
    /**
     * Tìm wishlist item theo wishlist ID và product ID
     */
    Optional<WishlistItem> findByWishlistIdAndProductId(Long wishlistId, Long productId);
    
    /**
     * Xóa item theo wishlist ID và product ID
     */
    void deleteByWishlistIdAndProductId(Long wishlistId, Long productId);
    
    /**
     * Kiểm tra product đã có trong wishlist chưa
     */
    Boolean existsByWishlistIdAndProductId(Long wishlistId, Long productId);
    
    /**
     * Kiểm tra wishlist item có thuộc về user không
     */
    @Query("SELECT CASE WHEN COUNT(wi) > 0 THEN true ELSE false END " +
           "FROM WishlistItem wi WHERE wi.product.id = :productId AND wi.wishlist.user.id = :userId")
    Boolean existsByProductIdAndUserId(@Param("productId") Long productId, @Param("userId") Long userId);
}

