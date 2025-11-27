package com.d4k.ecommerce.modules.product.repository;

import com.d4k.ecommerce.modules.product.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Category Repository
 * Data access layer cho Category entity
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Tìm tất cả root categories (không có parent)
     */
    List<Category> findByParentIsNull();
    
    /**
     * Tìm tất cả child categories của một parent
     */
    List<Category> findByParentId(Long parentId);
    
    /**
     * Kiểm tra category có tồn tại theo name không
     */
    Boolean existsByName(String name);
    
    /**
     * Kiểm tra category có tồn tại theo name (exclude một ID cụ thể)
     * Dùng cho update để check duplicate name
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM Category c WHERE c.name = :name AND c.id <> :excludeId")
    Boolean existsByNameExcludingId(String name, Long excludeId);
}

