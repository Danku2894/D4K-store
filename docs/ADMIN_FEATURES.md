# 🔐 Admin Features Documentation

Tài liệu hướng dẫn sử dụng các tính năng dành cho Admin.

## 📋 Tổng quan

Admin có quyền:
- ✅ Quản lý users (CRUD)
- 🔄 Quản lý products (Coming soon)
- 🔄 Quản lý orders (Coming soon)
- 🔄 Quản lý inventory (Coming soon)
- 🔄 Xem analytics/dashboard (Coming soon)

---

## 🔑 Đăng nhập Admin

### Default Admin Account

```
Email: admin@d4k.com
Password: admin123
```

**⚠️ CHÚ Ý**: Đổi password ngay sau lần đăng nhập đầu tiên trong production!

### Đăng nhập

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@d4k.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "fullName": "Administrator",
      "email": "admin@d4k.com",
      "role": "ADMIN"
    }
  },
  "message": "Login successful"
}
```

Lưu token để sử dụng cho các admin endpoints:
```bash
ADMIN_TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

---

## 👥 User Management

### 1. Xem danh sách users

```bash
curl -X GET "http://localhost:8080/api/v1/admin/users?page=0&size=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Features:**
- Pagination support
- Sorting (by id, fullName, email, createdAt)
- Filter by role (coming soon)
- Export to CSV (coming soon)

### 2. Tìm kiếm users

```bash
curl -X GET "http://localhost:8080/api/v1/admin/users/search?keyword=john" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Tìm kiếm trong:
- Email
- Full Name

### 3. Xem chi tiết user

```bash
curl -X GET "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 4. Cập nhật user

```bash
curl -X PUT "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "email": "updated@example.com",
    "role": "USER",
    "isActive": true
  }'
```

**Use cases:**
- Thay đổi role (USER ↔ ADMIN)
- Disable/Enable account (isActive)
- Update thông tin cá nhân
- Change email

### 5. Xóa user

```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**⚠️ Warning**: 
- Hard delete (xóa vĩnh viễn)
- Không thể recover
- Cân nhắc sử dụng soft delete (disable account) thay vì xóa

---

## 🛡️ Security & Permissions

### Role-Based Access Control

| Endpoint | USER | ADMIN |
|----------|------|-------|
| GET /api/v1/admin/users | ❌ | ✅ |
| GET /api/v1/admin/users/{id} | ❌ | ✅ |
| PUT /api/v1/admin/users/{id} | ❌ | ✅ |
| DELETE /api/v1/admin/users/{id} | ❌ | ✅ |

### JWT Token

Admin token phải:
- Valid (không expired)
- Chứa role = ADMIN
- Được gửi trong Authorization header

Format:
```
Authorization: Bearer {token}
```

### Token Expiration

- Default: 24 giờ
- Sau khi expire: Đăng nhập lại để lấy token mới
- Refresh token: Coming soon

---

## 📊 Dashboard & Analytics (Coming Soon)

### Planned Features

1. **User Statistics**
   - Total users
   - New users today/week/month
   - Active vs Inactive users
   - User growth chart

2. **Order Statistics**
   - Total orders
   - Revenue
   - Top selling products
   - Recent orders

3. **Product Statistics**
   - Total products
   - Low stock alerts
   - Out of stock items

---

## 🧪 Testing Admin Features

### Setup Test Data

1. **Create admin account**
```bash
# Already seeded via migration
# Email: admin@d4k.com
# Password: admin123
```

2. **Create test users**
```bash
# Register some test users
for i in {1..5}; do
  curl -X POST http://localhost:8080/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"fullName\": \"Test User $i\",
      \"email\": \"testuser$i@example.com\",
      \"password\": \"password123\"
    }"
done
```

3. **Login as admin**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@d4k.com",
    "password": "admin123"
  }'
```

4. **Test CRUD operations**
```bash
# Get all users
curl -X GET "http://localhost:8080/api/v1/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Update a user
curl -X PUT "http://localhost:8080/api/v1/admin/users/2" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated User",
    "email": "updated@example.com",
    "role": "USER",
    "isActive": false
  }'

# Search users
curl -X GET "http://localhost:8080/api/v1/admin/users/search?keyword=test" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Test Access Control

```bash
# Login as regular user
USER_TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser1@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

# Try to access admin endpoint (should fail with 403)
curl -X GET "http://localhost:8080/api/v1/admin/users" \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access Denied",
  "errorCode": "FORBIDDEN"
}
```

---

## 📝 Best Practices

### 1. Security

- ✅ Đổi password admin mặc định
- ✅ Sử dụng strong passwords
- ✅ Không share admin credentials
- ✅ Rotate tokens thường xuyên
- ✅ Log tất cả admin actions

### 2. User Management

- ✅ Disable thay vì delete khi có thể
- ✅ Verify trước khi delete
- ✅ Backup data trước khi thay đổi lớn
- ✅ Test trên staging environment trước

### 3. Performance

- ✅ Sử dụng pagination cho large datasets
- ✅ Cache frequently accessed data
- ✅ Index database properly
- ✅ Monitor query performance

---

## 🐛 Troubleshooting

### Issue 1: 403 Forbidden

**Problem**: Admin token nhưng vẫn bị từ chối

**Solution**:
```bash
# Check token có role ADMIN không
# Decode JWT token tại jwt.io
# Kiểm tra authorities trong token
```

### Issue 2: Token Expired

**Problem**: Token hết hạn

**Solution**:
```bash
# Login lại để lấy token mới
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@d4k.com","password":"admin123"}'
```

### Issue 3: Cannot Delete User

**Problem**: Foreign key constraint

**Solution**:
```bash
# Disable user thay vì delete
curl -X PUT "http://localhost:8080/api/v1/admin/users/{id}" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

---

## 🚀 Next Steps

- [ ] Implement audit logging
- [ ] Add user activity tracking
- [ ] Implement soft delete
- [ ] Add batch operations
- [ ] Export users to CSV/Excel
- [ ] Email notifications for user changes
- [ ] 2FA for admin accounts
- [ ] IP whitelisting for admin access

---

## 📚 Related Documentation

- [API Documentation](./api/admin-user-management.md)
- [Backend README](../backend/README.md)
- [Security Guide](./SECURITY.md) (Coming soon)
- [Deployment Guide](./guides/deployment-guide.md) (Coming soon)

---

**Admin Features Version**: 1.0.0  
**Last Updated**: November 27, 2025

