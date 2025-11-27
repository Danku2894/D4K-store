package com.d4k.ecommerce.modules.order.repository;

import com.d4k.ecommerce.modules.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * OrderItem Repository
 * Data access layer cho OrderItem entity
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    /**
     * Tìm items của một order
     */
    List<OrderItem> findByOrderId(Long orderId);
    
    /**
     * Tính tổng số lượng đã bán của một product
     */
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi " +
           "WHERE oi.product.id = :productId " +
           "AND oi.order.status = 'DELIVERED'")
    Long sumQuantitySoldByProductId(@Param("productId") Long productId);
    
    /**
     * Lấy top selling products
     */
    @Query("SELECT oi.product.id, oi.product.name, SUM(oi.quantity) as totalSold " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status = 'DELIVERED' " +
           "GROUP BY oi.product.id, oi.product.name " +
           "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingProducts(@Param("limit") int limit);
}
