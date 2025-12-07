package com.d4k.ecommerce.modules.product.mapper;

import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import com.d4k.ecommerce.modules.product.dto.response.ProductVariantResponse;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) return null;

        List<ProductVariantResponse> variantResponses = null;
        if (product.getVariants() != null) {
            variantResponses = product.getVariants().stream()
                    .map(this::toVariantResponse)
                    .collect(Collectors.toList());
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getTotalStock())
                .imageUrl(product.getImageUrl())
                .additionalImages(product.getImages() != null 
                        ? product.getImages().stream().map(com.d4k.ecommerce.modules.product.entity.ProductImage::getImageUrl).collect(Collectors.toList())
                        : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .isActive(product.getIsActive())
                .inStock(product.getTotalStock() > 0)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .variants(variantResponses)
                .build();
    }

    public ProductVariantResponse toVariantResponse(ProductVariant variant) {
        if (variant == null) return null;
        return ProductVariantResponse.builder()
                .id(variant.getId())
                .size(variant.getSize())
                .color(variant.getColor())
                .stock(variant.getStock())
                .priceAdjustment(variant.getPriceAdjustment())
                .build();
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        if (products == null) return List.of();
        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
