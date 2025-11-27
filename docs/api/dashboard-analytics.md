# Dashboard & Analytics API

API documentation cho admin dashboard và analytics/reporting.

## Base URL
```
/api/v1/admin/dashboard
```

**Authentication:** Required (ADMIN role only)

---

## 1. Dashboard Overview

**Endpoint:** `GET /api/v1/admin/dashboard/overview`

**Description:** Lấy thống kê tổng quan cho dashboard admin

### Response (200 OK)
```json
{
  "success": true,
  "message": "Dashboard overview fetched successfully",
  "data": {
    "totalUsers": 1250,
    "newUsersThisMonth": 85,
    "activeUsers": 1180,
    "totalProducts": 450,
    "activeProducts": 420,
    "lowStockProducts": 15,
    "outOfStockProducts": 10,
    "totalOrders": 0,
    "pendingOrders": 0,
    "completedOrders": 0,
    "cancelledOrders": 0,
    "totalRevenue": 0,
    "revenueThisMonth": 0,
    "revenueThisYear": 0,
    "averageOrderValue": 0,
    "totalReviews": 127,
    "averageRating": 4.3,
    "totalCoupons": 6,
    "activeCoupons": 4,
    "expiredCoupons": 2
  }
}
```

### Response Fields

#### User Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalUsers | Long | Tổng số users |
| newUsersThisMonth | Long | Users mới tháng này |
| activeUsers | Long | Users đang active |

#### Product Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalProducts | Long | Tổng số products |
| activeProducts | Long | Products còn hàng (stock > 0) |
| lowStockProducts | Long | Products sắp hết hàng (stock 1-10) |
| outOfStockProducts | Long | Products hết hàng (stock = 0) |

#### Order Statistics (TODO: Requires Order Module)
| Field | Type | Description |
|-------|------|-------------|
| totalOrders | Long | Tổng số orders |
| pendingOrders | Long | Orders đang chờ xử lý |
| completedOrders | Long | Orders đã hoàn thành |
| cancelledOrders | Long | Orders đã hủy |

#### Revenue Statistics (TODO: Requires Order Module)
| Field | Type | Description |
|-------|------|-------------|
| totalRevenue | BigDecimal | Tổng doanh thu |
| revenueThisMonth | BigDecimal | Doanh thu tháng này |
| revenueThisYear | BigDecimal | Doanh thu năm nay |
| averageOrderValue | BigDecimal | Giá trị đơn hàng trung bình |

#### Review Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalReviews | Long | Tổng số reviews |
| averageRating | Double | Rating trung bình (overall) |

#### Coupon Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalCoupons | Long | Tổng số coupons |
| activeCoupons | Long | Coupons đang active và valid |
| expiredCoupons | Long | Coupons đã hết hạn/inactive |

---

## 2. Sales Data

**Endpoint:** `GET /api/v1/admin/dashboard/sales`

**Description:** Lấy dữ liệu doanh thu theo thời gian (cho charts/graphs)

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| period | String | No | DAILY, MONTHLY, YEARLY (default: DAILY) |
| startDate | Date | Yes | Ngày bắt đầu (yyyy-MM-dd) |
| endDate | Date | Yes | Ngày kết thúc (yyyy-MM-dd) |

### Example Request
```
GET /api/v1/admin/dashboard/sales?period=DAILY&startDate=2025-11-01&endDate=2025-11-30
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Sales data fetched successfully",
  "data": {
    "period": "DAILY",
    "data": [
      {
        "date": "2025-11-01",
        "revenue": 0,
        "orderCount": 0
      },
      {
        "date": "2025-11-02",
        "revenue": 0,
        "orderCount": 0
      },
      ...
    ],
    "totalRevenue": 0,
    "totalOrders": 0
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| period | String | Loại period (DAILY/MONTHLY/YEARLY) |
| data | Array | Mảng data points |
| data[].date | String | Ngày/tháng/năm (format tùy period) |
| data[].revenue | BigDecimal | Doanh thu |
| data[].orderCount | Long | Số lượng orders |
| totalRevenue | BigDecimal | Tổng doanh thu trong khoảng |
| totalOrders | Long | Tổng số orders trong khoảng |

### Period Formats
- **DAILY**: date format `yyyy-MM-dd` (e.g., "2025-11-27")
- **MONTHLY**: date format `yyyy-MM` (e.g., "2025-11")
- **YEARLY**: date format `yyyy` (e.g., "2025")

### Error Responses

**400 Bad Request** - Invalid period
```json
{
  "success": false,
  "message": "Invalid period. Must be DAILY, MONTHLY, or YEARLY"
}
```

**400 Bad Request** - Invalid date range
```json
{
  "success": false,
  "message": "Start date must be before or equal to end date"
}
```

---

## 3. Top Products

**Endpoint:** `GET /api/v1/admin/dashboard/top-products`

**Description:** Lấy danh sách sản phẩm bán chạy nhất

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | Integer | No | Số lượng products (1-100, default: 10) |

### Example Request
```
GET /api/v1/admin/dashboard/top-products?limit=20
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Top products fetched successfully",
  "data": {
    "topProducts": [
      {
        "productId": 1,
        "productName": "Áo Thun Nam Basic",
        "categoryName": "Áo Nam",
        "price": 199000.00,
        "imageUrl": "https://example.com/image1.jpg",
        "totalSold": 0,
        "totalRevenue": 0,
        "reviewCount": 15,
        "averageRating": 4.5
      },
      {
        "productId": 5,
        "productName": "Áo Khoác Hoodie Unisex",
        "categoryName": "Áo Khoác",
        "price": 399000.00,
        "imageUrl": "https://example.com/image5.jpg",
        "totalSold": 0,
        "totalRevenue": 0,
        "reviewCount": 12,
        "averageRating": 4.7
      },
      ...
    ]
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| productId | Long | ID của product |
| productName | String | Tên product |
| categoryName | String | Tên category |
| price | BigDecimal | Giá bán |
| imageUrl | String | Link hình ảnh |
| totalSold | Long | Tổng số lượng đã bán (TODO) |
| totalRevenue | BigDecimal | Tổng doanh thu từ product (TODO) |
| reviewCount | Long | Số lượng reviews |
| averageRating | Double | Rating trung bình |

### Error Response

**400 Bad Request** - Invalid limit
```json
{
  "success": false,
  "message": "Limit must be between 1 and 100"
}
```

---

## Implementation Status

### Current Status
✅ **Implemented:**
- Dashboard overview endpoint
- Sales data endpoint (structure)
- Top products endpoint (structure)
- User statistics
- Product statistics
- Review statistics
- Coupon statistics

⏳ **TODO (Requires Order Module):**
- Order statistics (totalOrders, pendingOrders, completedOrders, cancelledOrders)
- Revenue statistics (totalRevenue, revenueThisMonth, revenueThisYear, averageOrderValue)
- Sales data calculation (actual revenue by day/month/year)
- Top products calculation (actual sales data, totalSold, totalRevenue)

### Current Behavior
- Order và Revenue fields trả về `0` hoặc `0.00`
- Sales data trả về empty/mock data points
- Top products được sắp xếp theo số lượng reviews thay vì sales (temporary)

### After Order Module
Sau khi implement Order module, cần:
1. Uncomment Order-related code trong `AnalyticsServiceImpl`
2. Implement queries trong `OrderRepository`:
   - `countByStatus(OrderStatus)`
   - `sumTotalAmount()`
   - `sumRevenueByMonth(YearMonth)`
   - `sumRevenueByYear(Year)`
   - `getSalesByDay(LocalDate, LocalDate)`
   - `getSalesByMonth(LocalDate, LocalDate)`
   - `getSalesByYear(LocalDate, LocalDate)`
   - `findTopSellingProducts(Integer limit)`
3. Update logic trong service methods
4. Test lại tất cả endpoints

---

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 OK | Request thành công |
| 400 Bad Request | Dữ liệu đầu vào không hợp lệ |
| 401 Unauthorized | Không có quyền truy cập |
| 403 Forbidden | Không phải ADMIN |
| 500 Internal Server Error | Lỗi server |

---

## Testing với cURL

### 1. Get Dashboard Overview
```bash
curl -X GET http://localhost:8080/api/v1/admin/dashboard/overview \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 2. Get Sales Data (Daily)
```bash
curl -X GET "http://localhost:8080/api/v1/admin/dashboard/sales?period=DAILY&startDate=2025-11-01&endDate=2025-11-30" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 3. Get Sales Data (Monthly)
```bash
curl -X GET "http://localhost:8080/api/v1/admin/dashboard/sales?period=MONTHLY&startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 4. Get Top Products
```bash
curl -X GET "http://localhost:8080/api/v1/admin/dashboard/top-products?limit=20" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

---

## Usage Examples

### Dashboard Overview Use Case
Admin vào dashboard, API trả về:
- **User Stats**: Hiển thị tổng users, users mới tháng này
- **Product Stats**: Hiển thị inventory status, cảnh báo low stock
- **Review Stats**: Hiển thị overall satisfaction (average rating)
- **Coupon Stats**: Hiển thị số lượng coupons đang hoạt động

### Sales Chart Use Case
Admin chọn xem doanh thu theo tháng:
```
Period: MONTHLY
Start: 2025-01-01
End: 2025-12-31
```
API trả về 12 data points (Jan - Dec) để vẽ line/bar chart.

### Top Products Use Case
Admin xem top 10 sản phẩm bán chạy:
```
Limit: 10
```
API trả về 10 products để hiển thị trong bảng/card view với:
- Tên sản phẩm
- Hình ảnh
- Số lượng đã bán (TODO)
- Doanh thu (TODO)
- Đánh giá

---

## Notes

1. **Authentication**: Tất cả endpoints yêu cầu ADMIN role.

2. **TODO Items**: Các fields và calculations liên quan đến Orders sẽ được implement sau khi có Order module.

3. **Date Format**: Sử dụng ISO 8601 date format (yyyy-MM-dd) cho query parameters.

4. **Performance**: Với lượng data lớn, nên:
   - Cache dashboard overview stats
   - Pagination cho top products nếu cần
   - Optimize database queries

5. **Real-time Updates**: Hiện tại data là static, có thể implement WebSocket hoặc polling để real-time updates trong tương lai.

---

## Future Enhancements

### Phase 2
- [ ] Category-wise sales breakdown
- [ ] User analytics (new vs returning customers)
- [ ] Geographic sales distribution
- [ ] Best/worst performing products
- [ ] Conversion rate metrics

### Phase 3
- [ ] Custom date range reports
- [ ] Export to CSV/Excel
- [ ] Scheduled reports (email)
- [ ] Advanced filtering
- [ ] Comparison views (this month vs last month)

### Phase 4
- [ ] Real-time dashboard updates
- [ ] Predictive analytics
- [ ] Inventory forecasting
- [ ] Customer segmentation analytics
- [ ] Marketing campaign performance

---

**Implemented by**: D4K Development Team  
**Date**: November 27, 2025  
**Status**: ✅ Ready (with TODO items for Order integration)

