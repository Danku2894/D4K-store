package com.d4k.ecommerce.modules.product.repository;

import com.d4k.ecommerce.modules.product.entity.ProductVariant;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductId(Long productId);

    void deleteByProductId(Long productId);

    /**
     * Tìm variant với PESSIMISTIC_WRITE lock để tránh race condition khi deduct stock.
     * Chỉ dùng khi cần write (tạo order, hủy order).
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM ProductVariant v WHERE v.product.id = :productId " +
           "AND LOWER(v.size) = LOWER(:size) " +
           "AND ((:color IS NULL AND v.color IS NULL) OR (LOWER(v.color) = LOWER(:color)))")
    Optional<ProductVariant> findByProductIdAndSizeAndColorWithLock(
            @Param("productId") Long productId,
            @Param("size") String size,
            @Param("color") String color
    );

    /**
     * Atomic deduct stock — chỉ deduct nếu stock đủ, trả về số rows affected.
     * Trả về 0 nếu insufficient stock (không thể deduct).
     */
    @Modifying
    @Query("UPDATE ProductVariant v SET v.stock = v.stock - :qty " +
           "WHERE v.id = :id AND v.stock >= :qty")
    int decrementStock(@Param("id") Long id, @Param("qty") int qty);

    /**
     * Atomic restore stock khi hủy order.
     */
    @Modifying
    @Query("UPDATE ProductVariant v SET v.stock = v.stock + :qty WHERE v.id = :id")
    int incrementStock(@Param("id") Long id, @Param("qty") int qty);
}
