package com.d4k.ecommerce.modules.product.repository;

import com.d4k.ecommerce.modules.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Product Repository
 * Data access layer cho Product entity
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Tìm products theo category ID
     */
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    /**
     * Tìm products theo category ID và isActive
     */
    Page<Product> findByCategoryIdAndIsActive(Long categoryId, Boolean isActive, Pageable pageable);
    
    /**
     * Tìm products active (public)
     */
    Page<Product> findByIsActive(Boolean isActive, Pageable pageable);
    
    /**
     * Tìm kiếm products theo keyword trong name hoặc description
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "p.isActive = :isActive")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, 
                                   @Param("isActive") Boolean isActive, 
                                   Pageable pageable);
    
    /**
     * Tìm products có stock thấp (warning)
     */
    @Query("SELECT p FROM Product p WHERE p.stock < :threshold AND p.isActive = true")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
    
    /**
     * Tìm products hết hàng
     */
    List<Product> findByStockAndIsActive(Integer stock, Boolean isActive);
    
    /**
     * Đếm products có stock lớn hơn threshold
     */
    Long countByStockGreaterThan(Integer threshold);
    
    /**
     * Đếm products có stock trong khoảng
     */
    Long countByStockBetween(Integer min, Integer max);
    
    /**
     * Đếm products có stock bằng giá trị cụ thể
     */
    Long countByStock(Integer stock);
}

