package com.d4k.ecommerce.modules.wishlist.entity;

import com.d4k.ecommerce.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Wishlist Entity
 * Danh sách yêu thích của user - mỗi user có 1 wishlist
 */
@Entity
@Table(name = "wishlists")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * One-to-One relationship với User
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    /**
     * Wishlist items
     */
    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WishlistItem> items = new ArrayList<>();
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Helper method: Add item to wishlist
     */
    public void addItem(WishlistItem item) {
        items.add(item);
        item.setWishlist(this);
    }
    
    /**
     * Helper method: Remove item from wishlist
     */
    public void removeItem(WishlistItem item) {
        items.remove(item);
        item.setWishlist(null);
    }
}

