package com.d4k.ecommerce.modules.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Address Entity
 * Địa chỉ giao hàng của user
 */
@Entity
@Table(name = "addresses",
    indexes = {
        @Index(name = "idx_address_user", columnList = "user_id"),
        @Index(name = "idx_address_default", columnList = "is_default")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * User sở hữu address này
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * Tên người nhận
     */
    @Column(name = "receiver_name", nullable = false, length = 100)
    private String receiverName;
    
    /**
     * Số điện thoại
     */
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;
    
    /**
     * Địa chỉ chi tiết
     */
    @Column(name = "address", nullable = false, length = 500)
    private String address;
    
    /**
     * Phường/Xã
     */
    @Column(name = "ward", length = 100)
    private String ward;
    
    /**
     * Quận/Huyện
     */
    @Column(name = "district", length = 100)
    private String district;
    
    /**
     * Tỉnh/Thành phố
     */
    @Column(name = "city", length = 100)
    private String city;
    
    /**
     * Địa chỉ mặc định
     */
    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private Boolean isDefault = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

