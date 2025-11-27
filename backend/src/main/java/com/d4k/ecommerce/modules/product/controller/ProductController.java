package com.d4k.ecommerce.modules.product.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public Product Controller
 * REST API endpoints công khai cho products (không cần authentication)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    /**
     * Lấy tất cả products (chỉ active)
     * GET /api/v1/products?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        log.info("Fetching all active products - page: {}, size: {}", page, size);
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<ProductResponse> products = productService.getAllProducts(pageable);
        
        PageResponse<ProductResponse> pageResponse = PageResponse.from(products);
        
        ApiResponse<PageResponse<ProductResponse>> response = ApiResponse.success(
                pageResponse,
                "Products retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy products theo category
     * GET /api/v1/products/category/{categoryId}?page=0&size=10
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Fetching products by category ID: {}", categoryId);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<ProductResponse> products = productService.getProductsByCategory(categoryId, pageable);
        
        PageResponse<ProductResponse> pageResponse = PageResponse.from(products);
        
        ApiResponse<PageResponse<ProductResponse>> response = ApiResponse.success(
                pageResponse,
                "Products retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Tìm kiếm products
     * GET /api/v1/products/search?keyword=shirt&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching products with keyword: {}", keyword);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<ProductResponse> products = productService.searchProducts(keyword, pageable);
        
        PageResponse<ProductResponse> pageResponse = PageResponse.from(products);
        
        ApiResponse<PageResponse<ProductResponse>> response = ApiResponse.success(
                pageResponse,
                "Products search completed successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy chi tiết product theo ID
     * GET /api/v1/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        log.info("Fetching product with ID: {}", id);
        
        ProductResponse product = productService.getProductById(id);
        
        ApiResponse<ProductResponse> response = ApiResponse.success(
                product,
                "Product retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
}

