package com.d4k.ecommerce.modules.product.service.impl;

import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.modules.product.dto.request.ProductRequest;
import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.product.entity.Category;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.mapper.ProductMapper;
import com.d4k.ecommerce.modules.product.repository.CategoryRepository;
import com.d4k.ecommerce.modules.product.repository.ProductRepository;
import com.d4k.ecommerce.modules.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Product Service Implementation
 * Xử lý business logic cho quản lý products
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    
    /**
     * Tạo product mới
     */
    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating new product: {}", request.getName());
        
        // Validate category tồn tại
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> {
                    log.error("Category not found with ID: {}", request.getCategoryId());
                    return new ResourceNotFoundException("Category", "id", request.getCategoryId());
                });
        
        // Validate stock
        if (request.getStock() < 0) {
            throw new BusinessException("Stock cannot be negative", "INVALID_STOCK");
        }
        
        // Validate price
        if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Price must be greater than 0", "INVALID_PRICE");
        }
        
        // Build product entity
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .category(category)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        
        // Lưu vào database
        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with ID: {}", savedProduct.getId());
        
        return productMapper.toResponse(savedProduct);
    }
    
    /**
     * Cập nhật product
     */
    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        log.info("Updating product with ID: {}", id);
        
        // Tìm product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Product not found with ID: {}", id);
                    return new ResourceNotFoundException("Product", "id", id);
                });
        
        // Validate category nếu thay đổi
        if (!product.getCategory().getId().equals(request.getCategoryId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> {
                        log.error("Category not found with ID: {}", request.getCategoryId());
                        return new ResourceNotFoundException("Category", "id", request.getCategoryId());
                    });
            product.setCategory(category);
        }
        
        // Validate stock
        if (request.getStock() < 0) {
            throw new BusinessException("Stock cannot be negative", "INVALID_STOCK");
        }
        
        // Validate price
        if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Price must be greater than 0", "INVALID_PRICE");
        }
        
        // Cập nhật thông tin
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        
        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        }
        
        // Lưu vào database
        Product updatedProduct = productRepository.save(product);
        log.info("Product updated successfully with ID: {}", id);
        
        return productMapper.toResponse(updatedProduct);
    }
    
    /**
     * Xóa product
     */
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product with ID: {}", id);
        
        // Kiểm tra product có tồn tại không
        if (!productRepository.existsById(id)) {
            log.error("Product not found with ID: {}", id);
            throw new ResourceNotFoundException("Product", "id", id);
        }
        
        // TODO: Kiểm tra product có trong orders không (implement sau)
        
        // Xóa product
        productRepository.deleteById(id);
        log.info("Product deleted successfully with ID: {}", id);
    }
    
    /**
     * Lấy chi tiết product
     */
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        log.info("Fetching product with ID: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Product not found with ID: {}", id);
                    return new ResourceNotFoundException("Product", "id", id);
                });
        
        return productMapper.toResponse(product);
    }
    
    /**
     * Lấy danh sách products (Public - chỉ active)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        log.info("Fetching all active products");
        
        Page<Product> products = productRepository.findByIsActive(true, pageable);
        
        return products.map(productMapper::toResponse);
    }
    
    /**
     * Lấy products theo category (Public - chỉ active)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        log.info("Fetching products by category ID: {}", categoryId);
        
        // Validate category tồn tại
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        
        Page<Product> products = productRepository.findByCategoryIdAndIsActive(
                categoryId, true, pageable);
        
        return products.map(productMapper::toResponse);
    }
    
    /**
     * Tìm kiếm products (Public - chỉ active)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        log.info("Searching products with keyword: {}", keyword);
        
        Page<Product> products = productRepository.searchByKeyword(keyword, true, pageable);
        
        return products.map(productMapper::toResponse);
    }
    
    /**
     * Lấy tất cả products (Admin - bao gồm inactive)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProductsAdmin(Pageable pageable) {
        log.info("Admin fetching all products");
        
        Page<Product> products = productRepository.findAll(pageable);
        
        return products.map(productMapper::toResponse);
    }
}

