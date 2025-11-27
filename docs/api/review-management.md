# Review Management API

API documentation cho quản lý đánh giá sản phẩm (Reviews).

## Base URL
```
/api/v1/reviews
```

---

## 1. Tạo Review Mới

**Endpoint:** `POST /api/v1/reviews`

**Authentication:** Required (USER role)

**Description:** User tạo review cho sản phẩm đã mua

### Request Body
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Sản phẩm rất tốt, chất lượng cao!"
}
```

### Request Fields
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| productId | Long | Yes | - | ID của sản phẩm cần review |
| rating | Integer | Yes | 1-5 | Điểm đánh giá (1-5 sao) |
| comment | String | No | Max 1000 chars | Nội dung đánh giá |

### Response (201 Created)
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "userName": "Nguyễn Văn A",
    "productId": 1,
    "productName": "Áo Thun Nam Basic",
    "rating": 5,
    "comment": "Sản phẩm rất tốt, chất lượng cao!",
    "createdAt": "2025-11-27T10:30:00"
  }
}
```

### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5",
  "errorCode": "INVALID_RATING"
}
```

**400 Bad Request** - Already reviewed
```json
{
  "success": false,
  "message": "You have already reviewed this product",
  "errorCode": "REVIEW_ALREADY_EXISTS"
}
```

**400 Bad Request** - Purchase required (TODO: Implement sau khi có Order module)
```json
{
  "success": false,
  "message": "You must purchase this product before reviewing",
  "errorCode": "PURCHASE_REQUIRED"
}
```

**404 Not Found** - Product not found
```json
{
  "success": false,
  "message": "Product not found with id: 999",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## 2. Lấy Reviews Của Sản Phẩm

**Endpoint:** `GET /api/v1/reviews/product/{productId}`

**Authentication:** Not Required (Public)

**Description:** Lấy danh sách reviews của một sản phẩm kèm thống kê rating

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| productId | Long | Yes | ID của sản phẩm |

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Integer | 0 | Số trang (bắt đầu từ 0) |
| size | Integer | 10 | Số lượng items mỗi trang |
| sortBy | String | createdAt | Field để sort (createdAt, rating) |
| sortDir | String | DESC | Hướng sort (ASC, DESC) |

### Example Request
```
GET /api/v1/reviews/product/1?page=0&size=10&sortBy=createdAt&sortDir=DESC
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Product reviews fetched successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 2,
        "userName": "Nguyễn Văn A",
        "productId": 1,
        "productName": "Áo Thun Nam Basic",
        "rating": 5,
        "comment": "Áo rất đẹp, chất liệu cotton thoáng mát!",
        "createdAt": "2025-11-27T10:30:00"
      },
      {
        "id": 2,
        "userId": 3,
        "userName": "Trần Thị B",
        "productId": 1,
        "productName": "Áo Thun Nam Basic",
        "rating": 4,
        "comment": "Áo đẹp nhưng màu hơi sai so với hình",
        "createdAt": "2025-11-26T15:20:00"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 2,
    "totalPages": 1,
    "last": true
  },
  "metadata": {
    "averageRating": 4.5,
    "totalReviews": 2
  }
}
```

### Error Responses

**404 Not Found** - Product not found
```json
{
  "success": false,
  "message": "Product not found with id: 999",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## 3. Lấy Reviews Của User Hiện Tại

**Endpoint:** `GET /api/v1/reviews/my-reviews`

**Authentication:** Required (USER role)

**Description:** Lấy danh sách tất cả reviews của user hiện tại

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Integer | 0 | Số trang (bắt đầu từ 0) |
| size | Integer | 10 | Số lượng items mỗi trang |
| sortBy | String | createdAt | Field để sort |
| sortDir | String | DESC | Hướng sort (ASC, DESC) |

### Example Request
```
GET /api/v1/reviews/my-reviews?page=0&size=10
Authorization: Bearer <token>
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "User reviews fetched successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 2,
        "userName": "Nguyễn Văn A",
        "productId": 1,
        "productName": "Áo Thun Nam Basic",
        "rating": 5,
        "comment": "Áo rất đẹp!",
        "createdAt": "2025-11-27T10:30:00"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  }
}
```

---

## 4. Xóa Review

**Endpoint:** `DELETE /api/v1/reviews/{id}`

**Authentication:** Required (USER hoặc ADMIN role)

**Description:** 
- USER: Chỉ có thể xóa review của chính mình
- ADMIN: Có thể xóa bất kỳ review nào

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | ID của review cần xóa |

### Example Request
```
DELETE /api/v1/reviews/1
Authorization: Bearer <token>
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Error Responses

**401 Unauthorized** - User không có quyền xóa review này
```json
{
  "success": false,
  "message": "You can only delete your own reviews",
  "errorCode": "UNAUTHORIZED"
}
```

**404 Not Found** - Review not found
```json
{
  "success": false,
  "message": "Review not found with id: 999",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## Business Rules

### 1. Review Creation
- User phải đăng nhập
- Rating phải từ 1-5
- 1 user chỉ review 1 product 1 lần
- **TODO:** User phải đã mua sản phẩm (có order với status DELIVERED)

### 2. Review Deletion
- USER: Chỉ xóa được review của mình
- ADMIN: Xóa được mọi review

### 3. Review Visibility
- Public: Tất cả người dùng đều xem được reviews
- Metadata: Average rating và total reviews được tính tự động

---

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 OK | Request thành công |
| 201 Created | Review được tạo thành công |
| 400 Bad Request | Dữ liệu đầu vào không hợp lệ |
| 401 Unauthorized | Không có quyền truy cập |
| 404 Not Found | Resource không tìm thấy |
| 500 Internal Server Error | Lỗi server |

---

## Testing với cURL

### 1. Create Review
```bash
curl -X POST http://localhost:8080/api/v1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "rating": 5,
    "comment": "Sản phẩm tuyệt vời!"
  }'
```

### 2. Get Product Reviews
```bash
curl -X GET "http://localhost:8080/api/v1/reviews/product/1?page=0&size=10"
```

### 3. Get My Reviews
```bash
curl -X GET "http://localhost:8080/api/v1/reviews/my-reviews?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Delete Review
```bash
curl -X DELETE http://localhost:8080/api/v1/reviews/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Notes

1. **Purchase Validation**: Hiện tại chưa validate user đã mua sản phẩm. Feature này sẽ được implement sau khi hoàn thành Order module.

2. **Rating Statistics**: Endpoint GET reviews by product tự động tính toán và trả về average rating và total reviews trong metadata.

3. **Unique Constraint**: Database đã có unique constraint để đảm bảo 1 user chỉ review 1 product 1 lần.

4. **Soft Delete**: Hiện tại sử dụng hard delete. Có thể implement soft delete sau nếu cần.

---

## Implementation Status

✅ Review Entity  
✅ Review Repository  
✅ Review DTOs  
✅ Review Mapper  
✅ Review Service  
✅ Review Controller  
✅ Database Migration  
✅ Seed Data  
⏳ Purchase Validation (TODO: sau khi có Order module)

