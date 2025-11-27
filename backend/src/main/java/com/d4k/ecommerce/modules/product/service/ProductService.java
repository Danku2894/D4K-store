package com.d4k.ecommerce.modules.product.service;

import com.d4k.ecommerce.modules.product.dto.request.ProductRequest;
import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Product Service Interface
 * Định nghĩa business logic cho quản lý products
 */
public interface ProductService {
    
    /**
     * Tạo product mới (Admin)
     * @param request thông tin product
     * @return product đã tạo
     */
    ProductResponse createProduct(ProductRequest request);
    
    /**
     * Cập nhật product (Admin)
     * @param id product ID
     * @param request thông tin cần cập nhật
     * @return product sau khi cập nhật
     */
    ProductResponse updateProduct(Long id, ProductRequest request);
    
    /**
     * Xóa product (Admin)
     * @param id product ID
     */
    void deleteProduct(Long id);
    
    /**
     * Lấy chi tiết product theo ID
     * @param id product ID
     * @return thông tin product
     */
    ProductResponse getProductById(Long id);
    
    /**
     * Lấy danh sách products có phân trang (Public - chỉ active)
     * @param pageable thông tin phân trang
     * @return danh sách products
     */
    Page<ProductResponse> getAllProducts(Pageable pageable);
    
    /**
     * Lấy danh sách products theo category (Public - chỉ active)
     * @param categoryId category ID
     * @param pageable thông tin phân trang
     * @return danh sách products
     */
    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);
    
    /**
     * Tìm kiếm products theo keyword (Public - chỉ active)
     * @param keyword từ khóa tìm kiếm
     * @param pageable thông tin phân trang
     * @return danh sách products
     */
    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);
    
    /**
     * Lấy tất cả products (Admin - bao gồm inactive)
     * @param pageable thông tin phân trang
     * @return danh sách products
     */
    Page<ProductResponse> getAllProductsAdmin(Pageable pageable);
}

