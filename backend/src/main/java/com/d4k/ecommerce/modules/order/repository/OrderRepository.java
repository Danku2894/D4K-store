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
import java.util.List;
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
    /**
     * Tính tổng doanh thu (bao gồm CONFIRMED, SHIPPED, DELIVERED)
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED')")
    BigDecimal sumTotalRevenue();
    
    /**
     * Tính doanh thu theo tháng (createdAt)
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') " +
           "AND YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month")
    BigDecimal sumRevenueByMonth(@Param("year") int year, @Param("month") int month);
    
    /**
     * Tính doanh thu theo năm (createdAt)
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') " +
           "AND YEAR(o.createdAt) = :year")
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

    /**
     * Tìm order number mới nhất theo prefix (để generate order number tiếp theo)
     */
    Optional<Order> findTopByOrderNumberStartingWithOrderByOrderNumberDesc(String prefix);

    // ================= ANALYTICS QUERIES =================

    /**
     * Thống kê doanh thu theo ngày (dựa trên createdAt)
     * Return: [Date(backend-dependent), BigDecimal(revenue), Long(count)]
     */
    @Query("SELECT DATE(o.createdAt) as date, SUM(o.totalAmount), COUNT(o) " +
           "FROM Order o " +
           "WHERE o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') " +
           "AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(o.createdAt) " +
           "ORDER BY date")
    List<Object[]> getSalesByDay(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Thống kê doanh thu theo tháng
     * Return: [Integer(year), Integer(month), BigDecimal(revenue), Long(count)]
     */
    @Query("SELECT YEAR(o.createdAt) as y, MONTH(o.createdAt) as m, SUM(o.totalAmount), COUNT(o) " +
           "FROM Order o " +
           "WHERE o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') " +
           "AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
           "ORDER BY y, m")
    List<Object[]> getSalesByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Thống kê doanh thu theo năm
     * Return: [Integer(year), BigDecimal(revenue), Long(count)]
     */
    @Query("SELECT YEAR(o.createdAt) as y, SUM(o.totalAmount), COUNT(o) " +
           "FROM Order o " +
           "WHERE o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') " +
           "AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(o.createdAt) " +
           "ORDER BY y")
    List<Object[]> getSalesByYear(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Top selling products
     * Return: [Product, Long(totalSold), BigDecimal(totalRevenue)]
     */
    /**
     * Top selling products
     * Return: [Product, Long(totalSold), BigDecimal(totalRevenue)]
     */
    @Query("SELECT oi.product, SUM(oi.quantity) as totalSold, SUM(oi.subtotal) as totalRevenue " +
           "FROM OrderItem oi " +
           "JOIN oi.order o " +
           "WHERE o.status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED') " +
           "GROUP BY oi.product " +
           "ORDER BY totalSold DESC")
    Page<Object[]> findTopSellingProducts(Pageable pageable);
}
