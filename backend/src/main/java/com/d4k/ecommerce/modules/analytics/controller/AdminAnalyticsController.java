package com.d4k.ecommerce.modules.analytics.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.analytics.dto.response.DashboardOverviewResponse;
import com.d4k.ecommerce.modules.analytics.dto.response.SalesDataResponse;
import com.d4k.ecommerce.modules.analytics.dto.response.TopProductsResponse;
import com.d4k.ecommerce.modules.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Admin Analytics Controller
 * REST API endpoints cho admin dashboard và analytics
 */
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    /**
     * Lấy thống kê tổng quan dashboard
     * Endpoint: GET /api/v1/admin/dashboard/overview
     * Access: ADMIN only
     */
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<DashboardOverviewResponse>> getDashboardOverview() {
        DashboardOverviewResponse response = analyticsService.getDashboardOverview();
        
        ApiResponse<DashboardOverviewResponse> apiResponse = 
                ApiResponse.<DashboardOverviewResponse>builder()
                .success(true)
                .message("Dashboard overview fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Lấy dữ liệu doanh thu theo thời gian
     * Endpoint: GET /api/v1/admin/dashboard/sales
     * Access: ADMIN only
     * 
     * @param period DAILY, MONTHLY, YEARLY
     * @param startDate ngày bắt đầu (format: yyyy-MM-dd)
     * @param endDate ngày kết thúc (format: yyyy-MM-dd)
     */
    @GetMapping("/sales")
    public ResponseEntity<ApiResponse<SalesDataResponse>> getSalesData(
            @RequestParam(defaultValue = "DAILY") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        // Validate period
        if (!period.matches("DAILY|MONTHLY|YEARLY")) {
            ApiResponse<SalesDataResponse> errorResponse = ApiResponse.<SalesDataResponse>builder()
                    .success(false)
                    .message("Invalid period. Must be DAILY, MONTHLY, or YEARLY")
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Validate dates
        if (startDate.isAfter(endDate)) {
            ApiResponse<SalesDataResponse> errorResponse = ApiResponse.<SalesDataResponse>builder()
                    .success(false)
                    .message("Start date must be before or equal to end date")
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        SalesDataResponse response = analyticsService.getSalesData(period, startDate, endDate);
        
        ApiResponse<SalesDataResponse> apiResponse = ApiResponse.<SalesDataResponse>builder()
                .success(true)
                .message("Sales data fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Lấy top products bán chạy
     * Endpoint: GET /api/v1/admin/dashboard/top-products
     * Access: ADMIN only
     * 
     * @param limit số lượng products (default: 10)
     */
    @GetMapping("/top-products")
    public ResponseEntity<ApiResponse<TopProductsResponse>> getTopProducts(
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        // Validate limit
        if (limit < 1 || limit > 100) {
            ApiResponse<TopProductsResponse> errorResponse = ApiResponse.<TopProductsResponse>builder()
                    .success(false)
                    .message("Limit must be between 1 and 100")
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        TopProductsResponse response = analyticsService.getTopProducts(limit);
        
        ApiResponse<TopProductsResponse> apiResponse = ApiResponse.<TopProductsResponse>builder()
                .success(true)
                .message("Top products fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
}

