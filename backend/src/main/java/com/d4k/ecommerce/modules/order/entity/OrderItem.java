package com.d4k.ecommerce.modules.order.entity;

import com.d4k.ecommerce.modules.product.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * OrderItem Entity
 * Chi tiết sản phẩm trong đơn hàng
 */
@Entity
@Table(name = "order_items",
    indexes = {
        @Index(name = "idx_order_item_order", columnList = "order_id"),
        @Index(name = "idx_order_item_product", columnList = "product_id")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Order chứa item này
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    /**
     * Product được đặt
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    /**
     * Tên sản phẩm (snapshot tại thời điểm đặt hàng)
     */
    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;
    
    /**
     * Size đã chọn
     */
    @Column(name = "size", length = 50)
    private String size;

    @Column(name = "color", length = 50)
    private String color;
    
    /**
     * Giá sản phẩm tại thời điểm đặt hàng
     */
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    /**
     * Số lượng
     */
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    /**
     * Tổng tiền (price * quantity)
     */
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    /**
     * URL hình ảnh (snapshot)
     */
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    /**
     * Calculate subtotal
     */
    public void calculateSubtotal() {
        this.subtotal = this.price.multiply(new BigDecimal(this.quantity));
    }
}
