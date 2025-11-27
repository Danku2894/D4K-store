package com.d4k.ecommerce.modules.order.entity;

import com.d4k.ecommerce.modules.order.enums.OrderStatus;
import com.d4k.ecommerce.modules.order.enums.PaymentMethod;
import com.d4k.ecommerce.modules.order.enums.PaymentStatus;
import com.d4k.ecommerce.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order Entity
 * Đơn hàng của khách hàng
 */
@Entity
@Table(name = "orders",
    indexes = {
        @Index(name = "idx_order_user", columnList = "user_id"),
        @Index(name = "idx_order_number", columnList = "order_number"),
        @Index(name = "idx_order_status", columnList = "status"),
        @Index(name = "idx_order_created", columnList = "created_at")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Mã đơn hàng (unique, format: ORD-YYYYMMDD-XXXXX)
     */
    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;
    
    /**
     * Người đặt hàng
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * Trạng thái đơn hàng
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private OrderStatus status;
    
    /**
     * Tổng tiền sản phẩm (trước giảm giá)
     */
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    /**
     * Phí vận chuyển
     */
    @Column(name = "shipping_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingFee;
    
    /**
     * Số tiền giảm giá (từ coupon)
     */
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;
    
    /**
     * Mã coupon đã sử dụng
     */
    @Column(name = "coupon_code", length = 50)
    private String couponCode;
    
    /**
     * Tổng tiền phải trả (sau giảm giá + shipping)
     */
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    /**
     * Phương thức thanh toán
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;
    
    /**
     * Trạng thái thanh toán
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus;
    
    /**
     * Thông tin người nhận
     */
    @Column(name = "receiver_name", nullable = false, length = 100)
    private String receiverName;
    
    @Column(name = "receiver_phone", nullable = false, length = 20)
    private String receiverPhone;
    
    /**
     * Địa chỉ giao hàng đầy đủ
     */
    @Column(name = "shipping_address", nullable = false, length = 500)
    private String shippingAddress;
    
    @Column(name = "shipping_city", length = 100)
    private String shippingCity;
    
    @Column(name = "shipping_district", length = 100)
    private String shippingDistrict;
    
    /**
     * Ghi chú đơn hàng
     */
    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
    
    /**
     * Danh sách items trong order
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * Thời gian hoàn thành đơn hàng
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    /**
     * Thời gian hủy đơn hàng
     */
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    /**
     * Lý do hủy
     */
    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;
    
    /**
     * Helper method: Thêm order item
     */
    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }
    
    /**
     * Helper method: Xóa order item
     */
    public void removeOrderItem(OrderItem item) {
        orderItems.remove(item);
        item.setOrder(null);
    }
    
    /**
     * Check xem order có thể hủy không
     */
    public boolean isCancellable() {
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }
    
    /**
     * Check xem order đã hoàn thành chưa
     */
    public boolean isCompleted() {
        return status == OrderStatus.DELIVERED;
    }
}
