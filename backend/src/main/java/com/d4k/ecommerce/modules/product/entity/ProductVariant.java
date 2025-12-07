package com.d4k.ecommerce.modules.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "size", nullable = false)
    private String size; // S, M, L, XL, etc.

    @Column(name = "color")
    private String color; // Optional: Red, Blue, etc.

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "price_adjustment")
    private BigDecimal priceAdjustment; // Optional: Add extra cost for specific variants
}
