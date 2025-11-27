package com.d4k.ecommerce.modules.promotion.repository;

import com.d4k.ecommerce.modules.promotion.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Coupon Repository
 * Data access layer cho Coupon entity
 */
@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    /**
     * Tìm coupon theo code (case-insensitive)
     */
    Optional<Coupon> findByCodeIgnoreCase(String code);
    
    /**
     * Check code đã tồn tại chưa
     */
    boolean existsByCodeIgnoreCase(String code);
    
    /**
     * Tìm tất cả coupons đang active
     */
    Page<Coupon> findByIsActiveTrue(Pageable pageable);
    
    /**
     * Tìm coupons đang active và còn hiệu lực
     * (trong khoảng thời gian và chưa hết lượt sử dụng)
     */
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true " +
           "AND c.startDate <= :now AND c.endDate >= :now " +
           "AND (c.usageLimit IS NULL OR c.usageCount < c.usageLimit)")
    Page<Coupon> findValidCoupons(@Param("now") LocalDateTime now, Pageable pageable);
    
    /**
     * Tìm coupon theo code và check valid
     */
    @Query("SELECT c FROM Coupon c WHERE UPPER(c.code) = UPPER(:code) " +
           "AND c.isActive = true " +
           "AND c.startDate <= :now AND c.endDate >= :now " +
           "AND (c.usageLimit IS NULL OR c.usageCount < c.usageLimit)")
    Optional<Coupon> findValidCouponByCode(@Param("code") String code, @Param("now") LocalDateTime now);
    
    /**
     * Search coupons theo code hoặc name
     */
    @Query("SELECT c FROM Coupon c WHERE " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Coupon> searchCoupons(@Param("keyword") String keyword, Pageable pageable);
}

