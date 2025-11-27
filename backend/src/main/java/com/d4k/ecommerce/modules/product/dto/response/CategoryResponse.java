package com.d4k.ecommerce.modules.product.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO response cho category
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {
    
    private Long id;
    
    private String name;
    
    private String description;
    
    private Long parentId;
    
    private String parentName;
    
    /**
     * Danh sách subcategories (optional, chỉ include khi cần)
     */
    private List<CategoryResponse> children;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

