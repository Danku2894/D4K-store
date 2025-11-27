package com.d4k.ecommerce.modules.product.service;

import com.d4k.ecommerce.modules.product.dto.request.CategoryRequest;
import com.d4k.ecommerce.modules.product.dto.response.CategoryResponse;

import java.util.List;

/**
 * Category Service Interface
 * Định nghĩa business logic cho quản lý categories
 */
public interface CategoryService {
    
    /**
     * Tạo category mới
     * @param request thông tin category
     * @return category đã tạo
     */
    CategoryResponse createCategory(CategoryRequest request);
    
    /**
     * Cập nhật category
     * @param id category ID
     * @param request thông tin cần cập nhật
     * @return category sau khi cập nhật
     */
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    
    /**
     * Xóa category
     * @param id category ID
     */
    void deleteCategory(Long id);
    
    /**
     * Lấy chi tiết category theo ID
     * @param id category ID
     * @return thông tin category
     */
    CategoryResponse getCategoryById(Long id);
    
    /**
     * Lấy tất cả categories (flat list)
     * @return danh sách categories
     */
    List<CategoryResponse> getAllCategories();
    
    /**
     * Lấy danh sách root categories (hierarchical tree)
     * @return danh sách root categories với children
     */
    List<CategoryResponse> getCategoryTree();
}

