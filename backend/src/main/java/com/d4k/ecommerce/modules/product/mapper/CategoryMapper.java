package com.d4k.ecommerce.modules.product.mapper;

import com.d4k.ecommerce.modules.product.dto.response.CategoryResponse;
import com.d4k.ecommerce.modules.product.entity.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Category Mapper
 * Convert giữa Entity và DTO
 */
@Component
public class CategoryMapper {
    
    /**
     * Convert Category entity sang CategoryResponse (không include children)
     */
    public CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }
        
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .parentName(category.getParent() != null ? category.getParent().getName() : null)
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert Category entity sang CategoryResponse (include children - recursive)
     */
    public CategoryResponse toResponseWithChildren(Category category) {
        if (category == null) {
            return null;
        }
        
        CategoryResponse response = toResponse(category);
        
        // Recursively map children
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            List<CategoryResponse> childrenResponses = category.getChildren()
                    .stream()
                    .map(this::toResponseWithChildren)
                    .collect(Collectors.toList());
            response.setChildren(childrenResponses);
        }
        
        return response;
    }
    
    /**
     * Convert list of categories to responses
     */
    public List<CategoryResponse> toResponseList(List<Category> categories) {
        return categories.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}

