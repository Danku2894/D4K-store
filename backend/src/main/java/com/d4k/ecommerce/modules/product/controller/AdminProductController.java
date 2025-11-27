package com.d4k.ecommerce.modules.product.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.product.dto.request.ProductRequest;
import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin Product Controller
 * REST API endpoints cho quản lý products (chỉ dành cho ADMIN)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {
    
    private final ProductService productService;
    
    /**
     * Lấy tất cả products (bao gồm inactive)
     * GET /api/v1/admin/products?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        log.info("Admin fetching all products - page: {}, size: {}", page, size);
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<ProductResponse> products = productService.getAllProductsAdmin(pageable);
        
        PageResponse<ProductResponse> pageResponse = PageResponse.from(products);
        
        ApiResponse<PageResponse<ProductResponse>> response = ApiResponse.success(
                pageResponse,
                "Products retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Tạo product mới
     * POST /api/v1/admin/products
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request) {
        
        log.info("Admin creating new product: {}", request.getName());
        
        ProductResponse product = productService.createProduct(request);
        
        ApiResponse<ProductResponse> response = ApiResponse.success(
                product,
                "Product created successfully"
        );
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Cập nhật product
     * PUT /api/v1/admin/products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        
        log.info("Admin updating product with ID: {}", id);
        
        ProductResponse product = productService.updateProduct(id, request);
        
        ApiResponse<ProductResponse> response = ApiResponse.success(
                product,
                "Product updated successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa product
     * DELETE /api/v1/admin/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        log.info("Admin deleting product with ID: {}", id);
        
        productService.deleteProduct(id);
        
        ApiResponse<Void> response = ApiResponse.success("Product deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}

