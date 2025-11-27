package com.d4k.ecommerce.modules.product.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.product.dto.request.CategoryRequest;
import com.d4k.ecommerce.modules.product.dto.response.CategoryResponse;
import com.d4k.ecommerce.modules.product.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin Category Controller
 * REST API endpoints cho quản lý categories (chỉ dành cho ADMIN)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {
    
    private final CategoryService categoryService;
    
    /**
     * Tạo category mới
     * POST /api/v1/admin/categories
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        
        log.info("Admin creating new category: {}", request.getName());
        
        CategoryResponse category = categoryService.createCategory(request);
        
        ApiResponse<CategoryResponse> response = ApiResponse.success(
                category,
                "Category created successfully"
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Cập nhật category
     * PUT /api/v1/admin/categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        
        log.info("Admin updating category with ID: {}", id);
        
        CategoryResponse category = categoryService.updateCategory(id, request);
        
        ApiResponse<CategoryResponse> response = ApiResponse.success(
                category,
                "Category updated successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa category
     * DELETE /api/v1/admin/categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        log.info("Admin deleting category with ID: {}", id);
        
        categoryService.deleteCategory(id);
        
        ApiResponse<Void> response = ApiResponse.success("Category deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}

