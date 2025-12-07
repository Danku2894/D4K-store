package com.d4k.ecommerce.modules.product.service.impl;

import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.modules.product.dto.request.ProductRequest;
import com.d4k.ecommerce.modules.product.dto.request.ProductVariantRequest;
import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.product.entity.Category;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.entity.ProductImage;
import com.d4k.ecommerce.modules.product.entity.ProductVariant;
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
        
        // Validate price
        if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Price must be greater than 0", "INVALID_PRICE");
        }
        
        // Create Product
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(category)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .stock(0) // Will be updated based on variants
                .build();
        
        // Handle Variants or Stock
        int totalStock = 0;
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantRequest vr : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .size(vr.getSize())
                        .color(vr.getColor())
                        .stock(vr.getStock())
                        .priceAdjustment(vr.getPriceAdjustment())
                        .build();
                product.getVariants().add(variant);
                totalStock += vr.getStock();
            }
        } else if (request.getStock() != null) {
            if (request.getStock() < 0) {
                throw new BusinessException("Stock cannot be negative", "INVALID_STOCK");
            }
            // Default variant
             ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .size("FREESIZE")
                        .stock(request.getStock())
                        .build();
             product.getVariants().add(variant);
             totalStock = request.getStock();
        }
        product.setStock(totalStock);

        // Handle Additional Images
        if (request.getAdditionalImages() != null && !request.getAdditionalImages().isEmpty()) {
            for (String imgUrl : request.getAdditionalImages()) {
                ProductImage productImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(imgUrl)
                        .build();
                product.getImages().add(productImage);
            }
        }
        
        // Save
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
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        // Update Category if needed
        if (request.getCategoryId() != null && !request.getCategoryId().equals(product.getCategory().getId())) {
             Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> {
                        log.error("Category not found with ID: {}", request.getCategoryId());
                        return new ResourceNotFoundException("Category", "id", request.getCategoryId());
                    });
             product.setCategory(category);
        }
        
        // Update basic fields
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new BusinessException("Price must be greater than 0", "INVALID_PRICE");
            }
            product.setPrice(request.getPrice());
        }
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        
        // Update Additional Images
        if (request.getAdditionalImages() != null) {
            product.getImages().clear();
            for (String imgUrl : request.getAdditionalImages()) {
                ProductImage productImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(imgUrl)
                        .build();
                product.getImages().add(productImage);
            }
        }
        
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        if (request.getStock() != null) product.setStock(request.getStock());
        
        // Update Variants
        if (request.getVariants() != null) {
            // Replace all variants
            product.getVariants().clear();
            for (ProductVariantRequest vr : request.getVariants()) {
                 ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .size(vr.getSize())
                        .color(vr.getColor())
                        .stock(vr.getStock())
                        .priceAdjustment(vr.getPriceAdjustment())
                        .build();
                product.getVariants().add(variant);
            }
        } else if (request.getStock() != null) {
            if (request.getStock() < 0) {
                throw new BusinessException("Stock cannot be negative", "INVALID_STOCK");
            }
            // Update default variant or create one
            if (product.getVariants().isEmpty()) {
                 ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .size("FREESIZE")
                        .stock(request.getStock())
                        .build();
                 product.getVariants().add(variant);
            } else if (product.getVariants().size() == 1) {
                // Update the single existing variant
                product.getVariants().get(0).setStock(request.getStock());
            }
            // If multiple variants exist and no variants provided in request, ignore stock update to be safe
        }
        
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
        
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }
        
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
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        return productMapper.toResponse(product);
    }
    
    /**
     * Lấy danh sách products (Public - chỉ active)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        log.info("Fetching all active products");
        return productRepository.findByIsActive(true, pageable)
                .map(productMapper::toResponse);
    }
    
    /**
     * Lấy products theo category (Public - chỉ active)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        log.info("Fetching products by category ID: {}", categoryId);
        
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        
        return productRepository.findByCategoryIdAndIsActive(categoryId, true, pageable)
                .map(productMapper::toResponse);
    }
    
    /**
     * Tìm kiếm products (Public - chỉ active)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        log.info("Searching products with keyword: {}", keyword);
        return productRepository.searchByKeyword(keyword, true, pageable)
                .map(productMapper::toResponse);
    }
    
    /**
     * Lấy tất cả products (Admin - bao gồm inactive)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProductsAdmin(Pageable pageable) {
        log.info("Admin fetching all products");
        return productRepository.findAll(pageable)
                .map(productMapper::toResponse);
    }
}
