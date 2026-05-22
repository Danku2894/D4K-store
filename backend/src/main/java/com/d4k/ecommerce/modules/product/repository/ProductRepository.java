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
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    /**
     * Kiểm tra xem có product nào thuộc category này không
     */
    boolean existsByCategoryId(Long categoryId);
    
    /**
     * Tìm products theo category ID và isActive
     */
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Page<Product> findByCategoryIdAndIsActive(Long categoryId, Boolean isActive, Pageable pageable);
    
    /**
     * Tìm products active (public)
     */
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Page<Product> findByIsActive(Boolean isActive, Pageable pageable);
    
    /**
     * Tìm products đang sale và active
     */
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Page<Product> findByIsSaleAndIsActive(Boolean isSale, Boolean isActive, Pageable pageable);
    
    /**
     * Tìm kiếm products theo keyword trong name hoặc description
     */
    /**
     * Tìm kiếm products theo keyword trong name hoặc description
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "p.isActive = :isActive")
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Page<Product> searchByKeyword(@Param("keyword") String keyword, 
                                   @Param("isActive") Boolean isActive, 
                                   Pageable pageable);
    
    /**
     * Đếm products có ít nhất 1 variant còn hàng (stock > 0)
     */
    @Query("SELECT COUNT(DISTINCT p) FROM Product p JOIN p.variants v WHERE v.stock > 0")
    Long countProductsWithStock();

    /**
     * Đếm products có tổng stock = 0
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE (SELECT COALESCE(SUM(v.stock), 0) FROM ProductVariant v WHERE v.product = p) = 0")
    Long countOutOfStockProducts();

    /**
     * Đếm products có tổng stock trong khoảng
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE (SELECT COALESCE(SUM(v.stock), 0) FROM ProductVariant v WHERE v.product = p) BETWEEN :min AND :max")
    Long countProductsWithTotalStockBetween(@Param("min") Integer min, @Param("max") Integer max);
    
    /**
     * Lấy sản phẩm cùng category, loại trừ sản phẩm hiện tại (cho Similar Products)
     */
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true AND p.id != :excludeId ORDER BY p.createdAt DESC")
    List<Product> findByCategoryIdAndIsActiveTrueAndIdNot(
        @Param("categoryId") Long categoryId, 
        @Param("excludeId") Long excludeId, 
        Pageable pageable
    );
    
    /**
     * Lấy sản phẩm active sắp xếp theo ngày tạo (fallback cho Popular Products)
     */
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Page<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
}

