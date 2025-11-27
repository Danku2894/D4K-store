package com.d4k.ecommerce.modules.order.repository;

import com.d4k.ecommerce.modules.order.entity.Order;
import com.d4k.ecommerce.modules.order.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Order Repository
 * Data access layer cho Order entity
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Tìm order theo order number
     */
    Optional<Order> findByOrderNumber(String orderNumber);
    
    /**
     * Tìm orders của user
     */
    Page<Order> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Tìm orders của user theo status
     */
    Page<Order> findByUserIdAndStatus(Long userId, OrderStatus status, Pageable pageable);
    
    /**
     * Tìm orders theo status
     */
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    /**
     * Đếm orders theo status
     */
    Long countByStatus(OrderStatus status);
    
    /**
     * Tính tổng doanh thu (chỉ orders DELIVERED)
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal sumTotalRevenue();
    
    /**
     * Tính doanh thu theo tháng
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.status = 'DELIVERED' " +
           "AND YEAR(o.completedAt) = :year AND MONTH(o.completedAt) = :month")
    BigDecimal sumRevenueByMonth(@Param("year") int year, @Param("month") int month);
    
    /**
     * Tính doanh thu theo năm
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.status = 'DELIVERED' " +
           "AND YEAR(o.completedAt) = :year")
    BigDecimal sumRevenueByYear(@Param("year") int year);
    
    /**
     * Lấy orders trong khoảng thời gian
     */
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    Page<Order> findOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate, 
                                        Pageable pageable);
    
    /**
     * Đếm orders của user
     */
    Long countByUserId(Long userId);
    
    /**
     * Kiểm tra user đã mua product chưa (cho review validation)
     */
    @Query("SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END " +
           "FROM OrderItem oi " +
           "WHERE oi.order.user.id = :userId " +
           "AND oi.product.id = :productId " +
           "AND oi.order.status = 'DELIVERED'")
    Boolean existsByUserIdAndProductIdAndDelivered(@Param("userId") Long userId, 
                                                    @Param("productId") Long productId);
    
    /**
     * Search orders
     */
    @Query("SELECT o FROM Order o WHERE " +
           "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.receiverName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.receiverPhone) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Order> searchOrders(@Param("keyword") String keyword, Pageable pageable);
}
