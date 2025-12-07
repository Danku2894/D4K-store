package com.d4k.ecommerce.modules.product.service.impl;

import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.modules.product.dto.request.CategoryRequest;
import com.d4k.ecommerce.modules.product.dto.response.CategoryResponse;
import com.d4k.ecommerce.modules.product.entity.Category;
import com.d4k.ecommerce.modules.product.mapper.CategoryMapper;
import com.d4k.ecommerce.modules.product.repository.CategoryRepository;
import com.d4k.ecommerce.modules.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Category Service Implementation
 * Xử lý business logic cho quản lý categories
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    
    /**
     * Tạo category mới
     */
    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        log.info("Creating new category with name: {}", request.getName());
        
        // Kiểm tra tên category đã tồn tại chưa
        if (categoryRepository.existsByName(request.getName())) {
            log.error("Category name already exists: {}", request.getName());
            throw new BusinessException("Category name already exists", "CATEGORY_NAME_EXISTS");
        }
        
        // Build category entity
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();
        
        // Set parent nếu có
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> {
                        log.error("Parent category not found with ID: {}", request.getParentId());
                        return new ResourceNotFoundException("Parent Category", "id", request.getParentId());
                    });
            category.setParent(parent);
        }
        
        // Lưu vào database
        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully with ID: {}", savedCategory.getId());
        
        return categoryMapper.toResponse(savedCategory);
    }
    
    /**
     * Cập nhật category
     */
    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        log.info("Updating category with ID: {}", id);
        
        // Tìm category
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Category not found with ID: {}", id);
                    return new ResourceNotFoundException("Category", "id", id);
                });
        
        // Kiểm tra tên mới có bị trùng với category khác không
        if (!category.getName().equals(request.getName())) {
            if (categoryRepository.existsByNameExcludingId(request.getName(), id)) {
                log.error("Category name already exists: {}", request.getName());
                throw new BusinessException("Category name already exists", "CATEGORY_NAME_EXISTS");
            }
        }
        
        // Cập nhật thông tin
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        
        // Cập nhật parent
        if (request.getParentId() != null) {
            // Không cho phép set parent là chính nó
            if (request.getParentId().equals(id)) {
                log.error("Cannot set category as its own parent");
                throw new BusinessException("Cannot set category as its own parent", "INVALID_PARENT");
            }
            
            // Kiểm tra parent tồn tại
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> {
                        log.error("Parent category not found with ID: {}", request.getParentId());
                        return new ResourceNotFoundException("Parent Category", "id", request.getParentId());
                    });
            
            // Không cho phép circular reference (parent là child của category này)
            if (isDescendant(category, parent)) {
                log.error("Cannot set parent as descendant of current category");
                throw new BusinessException("Cannot set parent as descendant", "CIRCULAR_REFERENCE");
            }
            
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
        
        // Lưu vào database
        Category updatedCategory = categoryRepository.save(category);
        log.info("Category updated successfully with ID: {}", id);
        
        return categoryMapper.toResponse(updatedCategory);
    }
    
    /**
     * Xóa category
     */
    @Override
    @Transactional
    public void deleteCategory(Long id) {
        log.info("Deleting category with ID: {}", id);
        
        // Kiểm tra category có tồn tại không
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Category not found with ID: {}", id);
                    return new ResourceNotFoundException("Category", "id", id);
                });
        
        // Kiểm tra category có children không
        if (!category.getChildren().isEmpty()) {
            log.error("Cannot delete category with children. ID: {}", id);
            throw new BusinessException(
                    "Cannot delete category with subcategories. Please delete subcategories first.",
                    "CATEGORY_HAS_CHILDREN"
            );
        }
        
        // TODO: Kiểm tra category có products không (sẽ implement sau)
        
        // Xóa category
        categoryRepository.deleteById(id);
        log.info("Category deleted successfully with ID: {}", id);
    }
    
    /**
     * Lấy chi tiết category
     */
    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        log.info("Fetching category with ID: {}", id);
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Category not found with ID: {}", id);
                    return new ResourceNotFoundException("Category", "id", id);
                });
        
        return categoryMapper.toResponse(category);
    }
    
    /**
     * Lấy tất cả categories (flat list)
     */
    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        log.info("Fetching all categories");
        
        List<Category> categories = categoryRepository.findAll();
        
        return categoryMapper.toResponseList(categories);
    }
    
    /**
     * Lấy category tree (hierarchical)
     */
    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoryTree() {
        log.info("Fetching category tree");
        
        // Lấy tất cả root categories (không có parent)
        List<Category> rootCategories = categoryRepository.findByParentIsNull();
        
        // Map sang response với children
        return rootCategories.stream()
                .map(categoryMapper::toResponseWithChildren)
                .toList();
    }
    
    /**
     * Helper method: Kiểm tra xem potentialParent có phải là descendant của category không
     */
    private boolean isDescendant(Category category, Category potentialParent) {
        Category current = potentialParent;
        while (current != null) {
            if (current.getId().equals(category.getId())) {
                return true;
            }
            current = current.getParent();
        }
        return false;
    }
}
