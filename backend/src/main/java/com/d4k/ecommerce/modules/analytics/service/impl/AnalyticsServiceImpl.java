package com.d4k.ecommerce.modules.analytics.service.impl;

import com.d4k.ecommerce.modules.analytics.dto.response.DashboardOverviewResponse;
import com.d4k.ecommerce.modules.analytics.dto.response.SalesDataResponse;
import com.d4k.ecommerce.modules.analytics.dto.response.TopProductsResponse;
import com.d4k.ecommerce.modules.analytics.service.AnalyticsService;
import com.d4k.ecommerce.modules.product.entity.Product;
import com.d4k.ecommerce.modules.product.repository.ProductRepository;
import com.d4k.ecommerce.modules.promotion.repository.CouponRepository;
import com.d4k.ecommerce.modules.review.repository.ReviewRepository;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

/**
 * Analytics Service Implementation
 * Xử lý business logic cho dashboard và analytics
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {
    
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final CouponRepository couponRepository;
    private final com.d4k.ecommerce.modules.order.repository.OrderRepository orderRepository;
    
    /**
     * Lấy thống kê tổng quan
     */
    @Override
    @Transactional(readOnly = true)
    public DashboardOverviewResponse getDashboardOverview() {
        log.info("Fetching dashboard overview statistics");
        
        // User Statistics
        Long totalUsers = userRepository.count();
        Long newUsersThisMonth = countNewUsersThisMonth();
        Long activeUsers = userRepository.countByIsActiveTrue();
        
        // Product Statistics
        Long totalProducts = productRepository.count();
        Long activeProducts = countActiveProducts();
        Long lowStockProducts = countLowStockProducts();
        Long outOfStockProducts = countOutOfStockProducts();
        
        // Review Statistics
        Long totalReviews = reviewRepository.count();
        Double averageRating = calculateOverallAverageRating();
        
        // Coupon Statistics
        Long totalCoupons = couponRepository.count();
        Long activeCoupons = countActiveCoupons();
        Long expiredCoupons = countExpiredCoupons();
        
        // Order & Revenue Statistics
        Long totalOrders = orderRepository.count();
        Long pendingOrders = orderRepository.countByStatus(com.d4k.ecommerce.modules.order.enums.OrderStatus.PENDING);
        Long completedOrders = orderRepository.countByStatus(com.d4k.ecommerce.modules.order.enums.OrderStatus.DELIVERED);
        Long cancelledOrders = orderRepository.countByStatus(com.d4k.ecommerce.modules.order.enums.OrderStatus.CANCELLED);
        
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;
        
        BigDecimal revenueThisMonth = orderRepository.sumRevenueByMonth(
            java.time.YearMonth.now().getYear(), 
            java.time.YearMonth.now().getMonthValue()
        );
        if (revenueThisMonth == null) revenueThisMonth = BigDecimal.ZERO;
        
        BigDecimal revenueThisYear = orderRepository.sumRevenueByYear(java.time.Year.now().getValue());
        if (revenueThisYear == null) revenueThisYear = BigDecimal.ZERO;
        
        BigDecimal averageOrderValue = totalOrders > 0 
            ? totalRevenue.divide(new BigDecimal(totalOrders), 2, java.math.RoundingMode.HALF_UP) 
            : BigDecimal.ZERO;
        
        return DashboardOverviewResponse.builder()
                // Users
                .totalUsers(totalUsers)
                .newUsersThisMonth(newUsersThisMonth)
                .activeUsers(activeUsers)
                // Products
                .totalProducts(totalProducts)
                .activeProducts(activeProducts)
                .lowStockProducts(lowStockProducts)
                .outOfStockProducts(outOfStockProducts)
                // Orders (TODO)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                // Revenue (TODO)
                .totalRevenue(totalRevenue)
                .revenueThisMonth(revenueThisMonth)
                .revenueThisYear(revenueThisYear)
                .averageOrderValue(averageOrderValue)
                // Reviews
                .totalReviews(totalReviews)
                .averageRating(averageRating)
                // Coupons
                .totalCoupons(totalCoupons)
                .activeCoupons(activeCoupons)
                .expiredCoupons(expiredCoupons)
                .build();
    }
    
    /**
     * Lấy dữ liệu doanh thu
     */
    @Override
    @Transactional(readOnly = true)
    public SalesDataResponse getSalesData(String period, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching sales data for period: {}, from {} to {}", period, startDate, endDate);
        
        // TODO: Implement sau khi có Order module
        // Tạm thời return empty data
        List<SalesDataResponse.SalesDataPoint> dataPoints = new ArrayList<>();
        
        /*
        TODO: Implement logic
        if ("DAILY".equalsIgnoreCase(period)) {
            dataPoints = orderRepository.getSalesByDay(startDate, endDate);
        } else if ("MONTHLY".equalsIgnoreCase(period)) {
            dataPoints = orderRepository.getSalesByMonth(startDate, endDate);
        } else if ("YEARLY".equalsIgnoreCase(period)) {
            dataPoints = orderRepository.getSalesByYear(startDate, endDate);
        }
        */
        
        // Mock data for demonstration
        if ("DAILY".equalsIgnoreCase(period)) {
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                dataPoints.add(SalesDataResponse.SalesDataPoint.builder()
                        .date(date.toString())
                        .revenue(BigDecimal.ZERO)
                        .orderCount(0L)
                        .build());
            }
        } else if ("MONTHLY".equalsIgnoreCase(period)) {
            YearMonth current = YearMonth.from(startDate);
            YearMonth end = YearMonth.from(endDate);
            while (!current.isAfter(end)) {
                dataPoints.add(SalesDataResponse.SalesDataPoint.builder()
                        .date(current.toString())
                        .revenue(BigDecimal.ZERO)
                        .orderCount(0L)
                        .build());
                current = current.plusMonths(1);
            }
        }
        
        return SalesDataResponse.builder()
                .period(period)
                .data(dataPoints)
                .totalRevenue(BigDecimal.ZERO)
                .totalOrders(0L)
                .build();
    }
    
    /**
     * Lấy top products
     */
    @Override
    @Transactional(readOnly = true)
    public TopProductsResponse getTopProducts(Integer limit) {
        log.info("Fetching top {} products", limit);
        
        // TODO: Implement sau khi có Order module
        // Tạm thời lấy products có nhiều reviews nhất
        List<Product> products = productRepository.findAll(PageRequest.of(0, limit != null ? limit : 10)).getContent();
        
        List<TopProductsResponse.TopProductItem> topProducts = new ArrayList<>();
        
        for (Product product : products) {
            Long reviewCount = reviewRepository.countByProductId(product.getId());
            Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId());
            
            topProducts.add(TopProductsResponse.TopProductItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                    .price(product.getPrice())
                    .imageUrl(product.getImageUrl())
                    .totalSold(0L) // TODO: from OrderItems
                    .totalRevenue(BigDecimal.ZERO) // TODO: from Orders
                    .reviewCount(reviewCount)
                    .averageRating(avgRating != null ? avgRating : 0.0)
                    .build());
        }
        
        /*
        TODO: Implement sau khi có Order module
        List<TopProductItem> topProducts = orderRepository.findTopSellingProducts(limit);
        */
        
        return TopProductsResponse.builder()
                .topProducts(topProducts)
                .build();
    }
    
    // ============== PRIVATE HELPER METHODS ==============
    
    /**
     * Đếm users mới tháng này
     */
    private Long countNewUsersThisMonth() {
        LocalDateTime startOfMonth = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0);
        
        return userRepository.countByCreatedAtAfter(startOfMonth);
    }
    
    /**
     * Đếm active products
     */
    private Long countActiveProducts() {
        // Products có stock > 0
        return productRepository.countProductsWithStock();
    }
    
    /**
     * Đếm low stock products (stock <= 10)
     */
    private Long countLowStockProducts() {
        return productRepository.countProductsWithTotalStockBetween(1, 10);
    }
    
    /**
     * Đếm out of stock products
     */
    private Long countOutOfStockProducts() {
        return productRepository.countOutOfStockProducts();
    }
    
    /**
     * Tính overall average rating
     */
    private Double calculateOverallAverageRating() {
        // Lấy tất cả products và tính trung bình rating của chúng
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            return 0.0;
        }
        
        double totalRating = 0.0;
        int count = 0;
        
        for (Product product : products) {
            Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId());
            if (avgRating != null && avgRating > 0) {
                totalRating += avgRating;
                count++;
            }
        }
        
        return count > 0 ? totalRating / count : 0.0;
    }
    
    /**
     * Đếm active coupons
     */
    private Long countActiveCoupons() {
        LocalDateTime now = LocalDateTime.now();
        return couponRepository.findValidCoupons(now, PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements();
    }
    
    /**
     * Đếm expired coupons
     */
    private Long countExpiredCoupons() {
        return couponRepository.count() - countActiveCoupons();
    }
}

