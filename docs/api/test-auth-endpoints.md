# 🧪 Hướng dẫn Test Authentication Endpoints

## Prerequisites

- Backend server đang chạy tại `http://localhost:8080`
- Database PostgreSQL đã được setup
- Tool: Postman, Insomnia, hoặc curl

---

## 1. Test Đăng Ký (Register)

### Request

```http
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

### Curl Command

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "password": "password123"
  }'
```

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "role": "USER",
    "createdAt": "2025-11-27T15:30:00"
  },
  "message": "User registered successfully",
  "timestamp": "2025-11-27T15:30:00.123456"
}
```

### Error Cases

#### 1. Email đã tồn tại (400 Bad Request)

```json
{
  "success": false,
  "message": "Email already exists",
  "errorCode": "EMAIL_ALREADY_EXISTS",
  "timestamp": "2025-11-27T15:30:00.123456"
}
```

#### 2. Validation Error (400 Bad Request)

**Request với email không hợp lệ:**
```json
{
  "fullName": "A",
  "email": "invalid-email",
  "password": "123"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "fullName": "Full name must be between 2 and 100 characters",
    "email": "Email must be valid",
    "password": "Password must be between 6 and 50 characters"
  },
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2025-11-27T15:30:00.123456"
}
```

---

## 2. Test Đăng Nhập (Login)

### Request

```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

### Curl Command

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nguyenvana@example.com",
    "password": "password123"
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuZ3V5ZW52YW5hQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAxMDg0NjAwLCJleHAiOjE3MDExNzEwMDB9.signature",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "fullName": "Nguyen Van A",
      "email": "nguyenvana@example.com",
      "role": "USER"
    }
  },
  "message": "Login successful",
  "timestamp": "2025-11-27T15:30:00.123456"
}
```

### Error Cases

#### 1. Sai email hoặc password (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid email or password",
  "errorCode": "UNAUTHORIZED",
  "timestamp": "2025-11-27T15:30:00.123456"
}
```

#### 2. Account bị vô hiệu hóa (401 Unauthorized)

```json
{
  "success": false,
  "message": "Account is inactive",
  "errorCode": "UNAUTHORIZED",
  "timestamp": "2025-11-27T15:30:00.123456"
}
```

---

## 3. Test Flow Hoàn Chỉnh

### Scenario: Đăng ký và đăng nhập thành công

```bash
# Step 1: Đăng ký tài khoản mới
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "testuser@example.com",
    "password": "securepass123"
  }'

# Step 2: Đăng nhập với tài khoản vừa tạo
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "securepass123"
  }'

# Step 3: Lưu token từ response để sử dụng cho các request khác
# Token format: Bearer eyJhbGciOiJIUzUxMiJ9...
```

---

## 4. Test với Postman

### Import Collection

1. Mở Postman
2. Click **Import** → **Raw text**
3. Paste collection JSON (sẽ cung cấp file riêng)
4. Click **Import**

### Setup Environment

1. Tạo Environment mới: `D4K-Ecommerce-Local`
2. Thêm variables:
   ```
   base_url: http://localhost:8080
   token: (sẽ tự động set sau khi login)
   ```

### Test Requests

1. **Register**: Select request → Click **Send**
2. **Login**: Select request → Click **Send** → Token sẽ tự động lưu vào environment
3. **Protected Endpoints**: Token sẽ tự động thêm vào Authorization header

---

## 5. Kiểm Tra Database

Sau khi đăng ký thành công, kiểm tra database:

```sql
-- Kết nối PostgreSQL
psql -U postgres -d d4k_ecommerce

-- Xem danh sách users
SELECT id, full_name, email, role, is_active, created_at 
FROM users;

-- Kiểm tra password đã được hash
SELECT id, email, password 
FROM users 
WHERE email = 'nguyenvana@example.com';
-- Password sẽ có dạng: $2a$10$...
```

---

## 6. Common Issues & Solutions

### Issue 1: Connection refused

**Lỗi**: `Connection refused: connect`

**Solution**:
```bash
# Kiểm tra backend có chạy không
curl http://localhost:8080/actuator/health

# Nếu không chạy, start backend
cd backend
mvn spring-boot:run
```

### Issue 2: Database connection error

**Lỗi**: `Could not open JPA EntityManager for transaction`

**Solution**:
```bash
# Kiểm tra PostgreSQL
sudo systemctl status postgresql

# Kiểm tra database tồn tại
psql -U postgres -l | grep d4k_ecommerce

# Kiểm tra credentials trong application.yml
```

### Issue 3: Validation errors

**Lỗi**: `Validation failed`

**Solution**:
- Email phải đúng format: `user@domain.com`
- Full name: 2-100 ký tự
- Password: 6-50 ký tự

---

## 7. Security Testing

### Test 1: Password được hash

```sql
-- Password trong DB phải là hash, không phải plain text
SELECT password FROM users LIMIT 1;
-- Output: $2a$10$XkR3... (BCrypt hash)
```

### Test 2: Token expiration

```bash
# Login và lấy token
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}' \
  | jq -r '.data.token')

# Decode token (sử dụng jwt.io hoặc tool khác)
# Kiểm tra exp (expiration time) = iat + 86400000ms (24h)
```

### Test 3: Không thể login với password sai

```bash
# Thử login với password sai 3 lần
for i in {1..3}; do
  curl -X POST http://localhost:8080/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpass"}'
  echo ""
done
# Tất cả đều trả về 401 Unauthorized
```

---

## 8. Performance Testing

### Test concurrent registrations

```bash
# Sử dụng Apache Bench
ab -n 100 -c 10 -p register.json -T application/json \
  http://localhost:8080/api/v1/auth/register
```

**register.json:**
```json
{
  "fullName": "Load Test User",
  "email": "loadtest@example.com",
  "password": "password123"
}
```

---

## Next Steps

Sau khi test xong Authentication:
1. ✅ Xác nhận API hoạt động đúng
2. ✅ Save token để sử dụng cho protected endpoints
3. 🔄 Tiếp tục implement Product Management module
4. 🔄 Test authorization (ADMIN vs USER roles)

---

**Happy Testing! 🚀**

