package com.d4k.ecommerce.modules.product.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.product.dto.response.CategoryResponse;
import com.d4k.ecommerce.modules.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public Category Controller
 * REST API endpoints công khai cho categories (không cần authentication)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    /**
     * Lấy tất cả categories (flat list)
     * GET /api/v1/categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        log.info("Fetching all categories");
        
        List<CategoryResponse> categories = categoryService.getAllCategories();
        
        ApiResponse<List<CategoryResponse>> response = ApiResponse.success(
                categories,
                "Categories retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy category tree (hierarchical)
     * GET /api/v1/categories/tree
     */
    @GetMapping("/tree")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategoryTree() {
        log.info("Fetching category tree");
        
        List<CategoryResponse> categoryTree = categoryService.getCategoryTree();
        
        ApiResponse<List<CategoryResponse>> response = ApiResponse.success(
                categoryTree,
                "Category tree retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy chi tiết category theo ID
     * GET /api/v1/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        log.info("Fetching category with ID: {}", id);
        
        CategoryResponse category = categoryService.getCategoryById(id);
        
        ApiResponse<CategoryResponse> response = ApiResponse.success(
                category,
                "Category retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
}

