package com.d4k.ecommerce.modules.analytics.service;

import com.d4k.ecommerce.modules.analytics.dto.response.DashboardOverviewResponse;
import com.d4k.ecommerce.modules.analytics.dto.response.SalesDataResponse;
import com.d4k.ecommerce.modules.analytics.dto.response.TopProductsResponse;

import java.time.LocalDate;

/**
 * Analytics Service Interface
 * Định nghĩa business logic cho dashboard và analytics
 */
public interface AnalyticsService {
    
    /**
     * Lấy thống kê tổng quan cho dashboard
     * @return overview statistics
     */
    DashboardOverviewResponse getDashboardOverview();
    
    /**
     * Lấy dữ liệu doanh thu theo thời gian
     * @param period "DAILY", "MONTHLY", "YEARLY"
     * @param startDate ngày bắt đầu
     * @param endDate ngày kết thúc
     * @return sales data
     */
    SalesDataResponse getSalesData(String period, LocalDate startDate, LocalDate endDate);
    
    /**
     * Lấy danh sách sản phẩm bán chạy
     * @param limit số lượng products
     * @return top selling products
     */
    TopProductsResponse getTopProducts(Integer limit);
}

