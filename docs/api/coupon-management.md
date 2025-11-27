# Coupon Management API

API documentation cho quản lý mã giảm giá / coupons.

## Base URLs
```
Admin: /api/v1/admin/coupons
Public: /api/v1/coupons
```

---

## ADMIN Endpoints

### 1. Tạo Coupon Mới

**Endpoint:** `POST /api/v1/admin/coupons`

**Authentication:** Required (ADMIN role)

**Description:** Admin tạo mã giảm giá mới

#### Request Body
```json
{
  "code": "SUMMER2025",
  "name": "Khuyến mãi hè 2025",
  "description": "Giảm 15% cho mọi đơn hàng trong mùa hè",
  "discountType": "PERCENTAGE",
  "discountValue": 15.00,
  "minOrderAmount": 200000.00,
  "maxDiscount": 100000.00,
  "startDate": "2025-06-01T00:00:00",
  "endDate": "2025-08-31T23:59:59",
  "usageLimit": 1000,
  "isActive": true
}
```

#### Request Fields
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| code | String | Yes | 3-50 chars, uppercase, A-Z0-9_- | Mã coupon (unique) |
| name | String | Yes | Max 200 chars | Tên coupon |
| description | String | No | Max 1000 chars | Mô tả chi tiết |
| discountType | Enum | Yes | PERCENTAGE, FIXED_AMOUNT | Loại giảm giá |
| discountValue | BigDecimal | Yes | > 0 | Giá trị giảm |
| minOrderAmount | BigDecimal | No | >= 0 | Đơn tối thiểu |
| maxDiscount | BigDecimal | No | >= 0 | Giảm tối đa (cho %) |
| startDate | DateTime | Yes | - | Ngày bắt đầu |
| endDate | DateTime | Yes | > startDate | Ngày kết thúc |
| usageLimit | Integer | No | >= 1 | Giới hạn sử dụng |
| isActive | Boolean | Yes | - | Trạng thái active |

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": 1,
    "code": "SUMMER2025",
    "name": "Khuyến mãi hè 2025",
    "description": "Giảm 15% cho mọi đơn hàng trong mùa hè",
    "discountType": "PERCENTAGE",
    "discountValue": 15.00,
    "minOrderAmount": 200000.00,
    "maxDiscount": 100000.00,
    "startDate": "2025-06-01T00:00:00",
    "endDate": "2025-08-31T23:59:59",
    "usageLimit": 1000,
    "usageCount": 0,
    "isActive": true,
    "isValid": false,
    "createdAt": "2025-11-27T10:00:00",
    "updatedAt": "2025-11-27T10:00:00"
  }
}
```

#### Error Responses

**400 Bad Request** - Code already exists
```json
{
  "success": false,
  "message": "Coupon code already exists",
  "errorCode": "COUPON_CODE_EXISTS"
}
```

**400 Bad Request** - Invalid date range
```json
{
  "success": false,
  "message": "Start date must be before end date",
  "errorCode": "INVALID_DATE_RANGE"
}
```

**400 Bad Request** - Invalid discount value
```json
{
  "success": false,
  "message": "Percentage discount must be between 0 and 100",
  "errorCode": "INVALID_DISCOUNT_VALUE"
}
```

---

### 2. Cập Nhật Coupon

**Endpoint:** `PUT /api/v1/admin/coupons/{id}`

**Authentication:** Required (ADMIN role)

**Description:** Admin cập nhật thông tin coupon

#### Request Body
Same as Create Coupon

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Coupon updated successfully",
  "data": { ... }
}
```

---

### 3. Xóa Coupon

**Endpoint:** `DELETE /api/v1/admin/coupons/{id}`

**Authentication:** Required (ADMIN role)

**Description:** Admin xóa coupon

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

#### Error Response

**404 Not Found**
```json
{
  "success": false,
  "message": "Coupon not found with id: 999",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

### 4. Lấy Chi Tiết Coupon

**Endpoint:** `GET /api/v1/admin/coupons/{id}`

**Authentication:** Required (ADMIN role)

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Coupon fetched successfully",
  "data": { ... }
}
```

---

### 5. Lấy Tất Cả Coupons

**Endpoint:** `GET /api/v1/admin/coupons`

**Authentication:** Required (ADMIN role)

**Description:** Lấy danh sách tất cả coupons (bao gồm inactive và expired)

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Integer | 0 | Số trang (bắt đầu từ 0) |
| size | Integer | 10 | Số lượng items mỗi trang |
| sortBy | String | createdAt | Field để sort |
| sortDir | String | DESC | Hướng sort (ASC, DESC) |

#### Example Request
```
GET /api/v1/admin/coupons?page=0&size=10&sortBy=createdAt&sortDir=DESC
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Coupons fetched successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "SUMMER2025",
        "name": "Khuyến mãi hè 2025",
        ...
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 25,
    "totalPages": 3,
    "last": false
  }
}
```

---

### 6. Search Coupons

**Endpoint:** `GET /api/v1/admin/coupons/search`

**Authentication:** Required (ADMIN role)

**Description:** Tìm kiếm coupons theo code hoặc name

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| keyword | String | Yes | Từ khóa tìm kiếm |
| page | Integer | No | Số trang (default: 0) |
| size | Integer | No | Số items/page (default: 10) |

#### Example Request
```
GET /api/v1/admin/coupons/search?keyword=SUMMER&page=0&size=10
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Coupons searched successfully",
  "data": {
    "content": [...],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 3,
    "totalPages": 1,
    "last": true
  }
}
```

---

## PUBLIC Endpoints

### 7. Lấy Coupons Đang Valid

**Endpoint:** `GET /api/v1/coupons`

**Authentication:** Not Required (Public)

**Description:** Lấy danh sách coupons đang active và còn hiệu lực

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Integer | 0 | Số trang |
| size | Integer | 10 | Số items/page |
| sortBy | String | startDate | Field để sort |
| sortDir | String | DESC | Hướng sort |

#### Example Request
```
GET /api/v1/coupons?page=0&size=10
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Valid coupons fetched successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "WELCOME10",
        "name": "Chào mừng khách hàng mới",
        "description": "Giảm 10% cho đơn hàng đầu tiên",
        "discountType": "PERCENTAGE",
        "discountValue": 10.00,
        "minOrderAmount": 200000.00,
        "maxDiscount": 50000.00,
        "startDate": "2025-11-27T00:00:00",
        "endDate": "2026-02-25T23:59:59",
        "usageLimit": null,
        "usageCount": 0,
        "isActive": true,
        "isValid": true,
        "createdAt": "2025-11-27T10:00:00",
        "updatedAt": "2025-11-27T10:00:00"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 5,
    "totalPages": 1,
    "last": true
  }
}
```

---

### 8. Verify Coupon Code

**Endpoint:** `GET /api/v1/coupons/verify/{code}`

**Authentication:** Not Required (Public)

**Description:** Kiểm tra mã coupon có hợp lệ không

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| code | String | Yes | Mã coupon cần verify |

#### Example Request
```
GET /api/v1/coupons/verify/WELCOME10
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "id": 1,
    "code": "WELCOME10",
    "name": "Chào mừng khách hàng mới",
    "discountType": "PERCENTAGE",
    "discountValue": 10.00,
    "minOrderAmount": 200000.00,
    "maxDiscount": 50000.00,
    ...
  }
}
```

#### Error Response

**400 Bad Request** - Invalid coupon
```json
{
  "success": false,
  "message": "Invalid or expired coupon code",
  "errorCode": "INVALID_COUPON"
}
```

---

### 9. Apply Coupon

**Endpoint:** `POST /api/v1/coupons/apply`

**Authentication:** Not Required (Public)

**Description:** Áp dụng coupon và tính toán discount amount

#### Request Body
```json
{
  "code": "WELCOME10",
  "orderAmount": 500000.00
}
```

#### Request Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | String | Yes | Mã coupon |
| orderAmount | BigDecimal | Yes | Tổng giá trị đơn hàng |

#### Response (200 OK) - Success
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "code": "WELCOME10",
    "name": "Chào mừng khách hàng mới",
    "isValid": true,
    "message": "Coupon applied successfully",
    "originalAmount": 500000.00,
    "discountAmount": 50000.00,
    "finalAmount": 450000.00
  }
}
```

#### Response (200 OK) - Failed validation
```json
{
  "success": false,
  "message": "Minimum order amount is 200000 VND",
  "data": {
    "code": "WELCOME10",
    "name": "Chào mừng khách hàng mới",
    "isValid": false,
    "message": "Minimum order amount is 200000 VND",
    "originalAmount": 100000.00,
    "discountAmount": 0.00,
    "finalAmount": 100000.00
  }
}
```

---

## Business Rules

### 1. Coupon Creation
- Code phải unique (case-insensitive)
- Code chỉ chứa chữ in hoa, số, gạch dưới và gạch ngang
- Start date phải trước end date
- PERCENTAGE: discount value 0-100
- FIXED_AMOUNT: discount value > 0
- Usage limit phải >= 1 hoặc null (không giới hạn)

### 2. Coupon Validation
Coupon valid khi:
- `isActive = true`
- Thời gian hiện tại nằm trong khoảng [startDate, endDate]
- `usageCount < usageLimit` (nếu có usageLimit)

### 3. Discount Calculation

#### PERCENTAGE Discount
```
discount = (orderAmount * discountValue) / 100
if (maxDiscount != null && discount > maxDiscount) {
    discount = maxDiscount
}
```

#### FIXED_AMOUNT Discount
```
discount = discountValue
if (discount > orderAmount) {
    discount = orderAmount
}
```

### 4. Min Order Validation
- Nếu `minOrderAmount` được set, order amount phải >= minOrderAmount
- Nếu không đạt, coupon không được áp dụng

---

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 OK | Request thành công |
| 201 Created | Coupon được tạo thành công |
| 400 Bad Request | Dữ liệu đầu vào không hợp lệ |
| 401 Unauthorized | Không có quyền truy cập |
| 404 Not Found | Coupon không tìm thấy |
| 500 Internal Server Error | Lỗi server |

---

## Testing với cURL

### 1. Create Coupon (Admin)
```bash
curl -X POST http://localhost:8080/api/v1/admin/coupons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "code": "TEST10",
    "name": "Test Coupon",
    "description": "Test coupon for development",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "minOrderAmount": 100000,
    "maxDiscount": 50000,
    "startDate": "2025-11-27T00:00:00",
    "endDate": "2025-12-31T23:59:59",
    "usageLimit": 100,
    "isActive": true
  }'
```

### 2. Get Valid Coupons (Public)
```bash
curl -X GET "http://localhost:8080/api/v1/coupons?page=0&size=10"
```

### 3. Verify Coupon (Public)
```bash
curl -X GET http://localhost:8080/api/v1/coupons/verify/WELCOME10
```

### 4. Apply Coupon (Public)
```bash
curl -X POST http://localhost:8080/api/v1/coupons/apply \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "orderAmount": 500000
  }'
```

### 5. Update Coupon (Admin)
```bash
curl -X PUT http://localhost:8080/api/v1/admin/coupons/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "code": "WELCOME15",
    "name": "Updated Welcome Coupon",
    ...
  }'
```

### 6. Delete Coupon (Admin)
```bash
curl -X DELETE http://localhost:8080/api/v1/admin/coupons/1 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

---

## Notes

1. **Code Format**: Coupon code tự động được convert sang uppercase khi tạo.

2. **isValid Field**: Là calculated field, được tính toán runtime dựa trên isActive, dates, và usage count.

3. **Usage Count**: Hiện tại chưa tự động increment khi apply coupon. Sẽ được integrate với Order module để tự động tăng khi order thành công.

4. **Date Format**: Sử dụng ISO 8601 format (yyyy-MM-ddTHH:mm:ss).

5. **BigDecimal Precision**: Discount calculations sử dụng precision 2 decimal places và HALF_UP rounding mode.

---

## Implementation Status

✅ Coupon Entity  
✅ Coupon Repository  
✅ Coupon DTOs  
✅ Coupon Mapper  
✅ Coupon Service  
✅ Admin Controller  
✅ Public Controller  
✅ Database Migration  
✅ Seed Data  
✅ Validation Logic  
✅ Discount Calculation  
⏳ Usage count integration (TODO: với Order module)

