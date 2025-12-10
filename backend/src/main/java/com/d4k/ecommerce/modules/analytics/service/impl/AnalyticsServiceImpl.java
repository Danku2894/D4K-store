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
        
        List<SalesDataResponse.SalesDataPoint> dataPoints = new ArrayList<>();
        List<Object[]> rawData = new ArrayList<>();
        
        // 1. Fetch raw data from Repository
        if ("DAILY".equalsIgnoreCase(period)) {
            // startDate and endDate come as LocalDate, need to convert to LocalDateTime 
            // startDate at 00:00:00, endDate at 23:59:59
            rawData = orderRepository.getSalesByDay(startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusSeconds(1));
        } else if ("MONTHLY".equalsIgnoreCase(period)) {
            rawData = orderRepository.getSalesByMonth(startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusSeconds(1));
        } else if ("YEARLY".equalsIgnoreCase(period)) {
            rawData = orderRepository.getSalesByYear(startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay().minusSeconds(1));
        }
        
        // 2. Map raw data to DTO
        BigDecimal totalRevenue = BigDecimal.ZERO;
        Long totalOrders = 0L;
        
        for (Object[] row : rawData) {
            String dateLabel = "";
            BigDecimal revenue = (BigDecimal) row[row.length - 2];
            Long count = (Long) row[row.length - 1];
            
            if ("DAILY".equalsIgnoreCase(period)) {
                // row[0] is Date
                dateLabel = row[0].toString();
            } else if ("MONTHLY".equalsIgnoreCase(period)) {
                // row[0] is Year, row[1] is Month
                int y = (Integer) row[0];
                int m = (Integer) row[1];
                dateLabel = String.format("%d-%02d", y, m);
            } else {
                // row[0] is Year
                int y = (Integer) row[0];
                dateLabel = String.valueOf(y);
            }
            
            if (revenue == null) revenue = BigDecimal.ZERO;
            
            dataPoints.add(SalesDataResponse.SalesDataPoint.builder()
                    .date(dateLabel)
                    .revenue(revenue)
                    .orderCount(count)
                    .build());
            
            totalRevenue = totalRevenue.add(revenue);
            totalOrders += count;
        }
        
        return SalesDataResponse.builder()
                .period(period)
                .data(dataPoints)
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .build();
    }
    
    /**
     * Lấy top products
     */
    @Override
    @Transactional(readOnly = true)
    public TopProductsResponse getTopProducts(Integer limit) {
        int max = (limit != null && limit > 0) ? limit : 10;
        log.info("Fetching top {} selling products", max);
        
        List<Object[]> rawData = orderRepository.findTopSellingProducts(PageRequest.of(0, max)).getContent();
        List<TopProductsResponse.TopProductItem> topProducts = new ArrayList<>();
        
        for (Object[] row : rawData) {
            Product product = (Product) row[0];
            Long totalSold = (Long) row[1];
            BigDecimal revenue = (BigDecimal) row[2];
            
            // Get review stats
            Long reviewCount = reviewRepository.countByProductId(product.getId());
            Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId());
            
            topProducts.add(TopProductsResponse.TopProductItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                    .price(product.getPrice())
                    .imageUrl(product.getImageUrl())
                    .totalSold(totalSold)
                    .totalRevenue(revenue)
                    .reviewCount(reviewCount)
                    .averageRating(avgRating != null ? avgRating : 0.0)
                    .build());
        }
        
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

