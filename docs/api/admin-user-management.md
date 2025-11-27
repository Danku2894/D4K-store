# 👥 Admin User Management API

API endpoints để quản lý users (chỉ dành cho ADMIN).

## Authentication Required

Tất cả endpoints trong tài liệu này yêu cầu:
- **JWT Token** trong Authorization header
- **Role ADMIN**

```http
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

---

## 1. Lấy danh sách users (Paginated)

### Request

```http
GET /api/v1/admin/users?page=0&size=10&sortBy=createdAt&direction=desc
Authorization: Bearer {admin_token}
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Số trang (bắt đầu từ 0) |
| size | int | 10 | Số lượng items mỗi trang |
| sortBy | string | createdAt | Trường để sort (id, fullName, email, createdAt) |
| direction | string | desc | Hướng sort (asc hoặc desc) |

### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/admin/users?page=0&size=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "fullName": "Admin User",
        "email": "admin@example.com",
        "role": "ADMIN",
        "isActive": true,
        "createdAt": "2025-11-27T10:00:00",
        "updatedAt": "2025-11-27T10:00:00"
      },
      {
        "id": 2,
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "isActive": true,
        "createdAt": "2025-11-27T11:00:00",
        "updatedAt": "2025-11-27T11:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 2,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "message": "Users retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

## 2. Tìm kiếm users

### Request

```http
GET /api/v1/admin/users/search?keyword=john&page=0&size=10
Authorization: Bearer {admin_token}
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| keyword | string | Yes | Từ khóa tìm kiếm (trong email hoặc fullName) |
| page | int | No | Số trang (default: 0) |
| size | int | No | Số lượng items (default: 10) |

### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/admin/users/search?keyword=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 2,
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "isActive": true,
        "createdAt": "2025-11-27T11:00:00",
        "updatedAt": "2025-11-27T11:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "message": "Users search completed successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

## 3. Lấy chi tiết user theo ID

### Request

```http
GET /api/v1/admin/users/{id}
Authorization: Bearer {admin_token}
```

### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 2,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-11-27T11:00:00",
    "updatedAt": "2025-11-27T11:00:00"
  },
  "message": "User retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "User not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

## 4. Cập nhật thông tin user

### Request

```http
PUT /api/v1/admin/users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "fullName": "John Smith",
  "email": "johnsmith@example.com",
  "role": "ADMIN",
  "isActive": true
}
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | string | Yes | Tên đầy đủ (2-100 ký tự) |
| email | string | Yes | Email hợp lệ |
| role | string | No | Role: ADMIN hoặc USER |
| isActive | boolean | No | Trạng thái active |

### Curl Command

```bash
curl -X PUT "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "johnsmith@example.com",
    "role": "ADMIN",
    "isActive": true
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 2,
    "fullName": "John Smith",
    "email": "johnsmith@example.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-11-27T11:00:00",
    "updatedAt": "2025-11-27T15:35:00"
  },
  "message": "User updated successfully",
  "timestamp": "2025-11-27T15:35:00"
}
```

### Error Responses

#### Email đã tồn tại (400 Bad Request)

```json
{
  "success": false,
  "message": "Email already exists",
  "errorCode": "EMAIL_ALREADY_EXISTS",
  "timestamp": "2025-11-27T15:35:00"
}
```

#### Validation Error (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "fullName": "Full name must be between 2 and 100 characters",
    "email": "Email must be valid"
  },
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2025-11-27T15:35:00"
}
```

---

## 5. Xóa user

### Request

```http
DELETE /api/v1/admin/users/{id}
Authorization: Bearer {admin_token}
```

### Curl Command

```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "User deleted successfully",
  "timestamp": "2025-11-27T15:40:00"
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "User not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2025-11-27T15:40:00"
}
```

---

## Common Error Responses

### 401 Unauthorized (No token hoặc token invalid)

```json
{
  "success": false,
  "message": "Unauthorized - Please login to access this resource",
  "errorCode": "UNAUTHORIZED",
  "timestamp": "2025-11-27T15:30:00"
}
```

### 403 Forbidden (Không phải ADMIN)

```json
{
  "success": false,
  "message": "Access Denied",
  "errorCode": "FORBIDDEN",
  "timestamp": "2025-11-27T15:30:00"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later.",
  "errorCode": "INTERNAL_SERVER_ERROR",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

## Testing Flow

### Step 1: Login với ADMIN account

```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpass123"
  }'

# Save token từ response
TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

### Step 2: Test các endpoints

```bash
# 1. Get all users
curl -X GET "http://localhost:8080/api/v1/admin/users" \
  -H "Authorization: Bearer $TOKEN"

# 2. Search users
curl -X GET "http://localhost:8080/api/v1/admin/users/search?keyword=john" \
  -H "Authorization: Bearer $TOKEN"

# 3. Get user by ID
curl -X GET "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer $TOKEN"

# 4. Update user
curl -X PUT "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "email": "updated@example.com",
    "role": "USER",
    "isActive": true
  }'

# 5. Delete user
curl -X DELETE "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer $TOKEN"
```

### Step 3: Test với USER role (should fail)

```bash
# Login với USER account
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "userpass123"
  }'

USER_TOKEN="..."

# Try to access admin endpoint (should return 403 Forbidden)
curl -X GET "http://localhost:8080/api/v1/admin/users" \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

## Database Verification

Kiểm tra database sau khi thực hiện operations:

```sql
-- View all users
SELECT id, full_name, email, role, is_active, created_at, updated_at
FROM users
ORDER BY created_at DESC;

-- Count users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- Find inactive users
SELECT id, full_name, email, is_active
FROM users
WHERE is_active = false;
```

---

## Best Practices

1. **Always authenticate**: Đảm bảo có valid admin token
2. **Validate input**: Check email format, fullName length trước khi gửi
3. **Handle pagination**: Sử dụng page và size hợp lý (max 100)
4. **Error handling**: Luôn kiểm tra response status và error codes
5. **Don't delete yourself**: Admin không nên xóa chính mình
6. **Audit trail**: Log tất cả admin operations (coming soon)

---

## Postman Collection

Import collection từ file: `docs/api/postman-collection.json`

Environment variables:
```json
{
  "base_url": "http://localhost:8080",
  "admin_token": "{{token}}",
  "user_id": "2"
}
```

---

**Happy Testing! 🚀**

