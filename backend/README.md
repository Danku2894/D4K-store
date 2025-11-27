# D4K E-commerce Backend

Backend API cho dự án E-commerce Thời Trang sử dụng Spring Boot 3.2.0 và PostgreSQL.

## Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL 15+
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **ORM**: Spring Data JPA / Hibernate

## Yêu cầu hệ thống

- Java 17 hoặc cao hơn
- Maven 3.8+
- PostgreSQL 15+
- IDE: IntelliJ IDEA / Eclipse / VS Code

## Cài đặt

### 1. Clone project

```bash
cd backend
```

### 2. Cài đặt PostgreSQL

Tạo database:

```sql
CREATE DATABASE d4k_ecommerce;
```

### 3. Cấu hình Database

Cập nhật `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/d4k_ecommerce
    username: your_username
    password: your_password
```

### 4. Build project

```bash
mvn clean install
```

### 5. Chạy ứng dụng

```bash
mvn spring-boot:run
```

Hoặc chạy file `EcommerceApplication.java` từ IDE.

Server sẽ chạy tại: `http://localhost:8080`

## API Endpoints

### Authentication

#### Đăng ký
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
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
  "timestamp": "2025-11-27T15:30:00"
}
```

#### Đăng nhập
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "fullName": "Nguyen Van A",
      "email": "nguyenvana@example.com",
      "role": "USER"
    }
  },
  "message": "Login successful",
  "timestamp": "2025-11-27T15:30:00"
}
```

### Error Responses

#### 400 Bad Request (Email đã tồn tại)
```json
{
  "success": false,
  "message": "Email already exists",
  "errorCode": "EMAIL_ALREADY_EXISTS",
  "timestamp": "2025-11-27T15:30:00"
}
```

#### 401 Unauthorized (Sai thông tin đăng nhập)
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errorCode": "UNAUTHORIZED",
  "timestamp": "2025-11-27T15:30:00"
}
```

## API Documentation (Swagger)

Sau khi chạy server, truy cập Swagger UI tại:

```
http://localhost:8080/swagger-ui/index.html
```

## Cấu trúc Project

```
backend/
├── src/main/java/com/d4k/ecommerce/
│   ├── EcommerceApplication.java          # Main class
│   ├── config/                            # Configuration classes
│   │   ├── SecurityConfig.java            # Spring Security config
│   │   └── CorsConfig.java                # CORS config
│   ├── common/                            # Shared code
│   │   ├── constants/                     # Constants
│   │   ├── exception/                     # Exception handling
│   │   └── response/                      # Standard response
│   ├── security/                          # Security layer
│   │   └── jwt/                           # JWT implementation
│   └── modules/                           # Feature modules
│       ├── auth/                          # Authentication
│       │   ├── controller/
│       │   ├── service/
│       │   └── dto/
│       └── user/                          # User management
│           ├── entity/
│           ├── repository/
│           └── enums/
└── src/main/resources/
    └── application.yml                    # Application config
```

## Testing

### Test với Postman

Import Postman collection từ `docs/api/postman-collection.json`

### Test với curl

**Đăng ký:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Đăng nhập:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Clean Architecture

Project tuân theo nguyên tắc Clean Architecture:

- **Controller**: Nhận HTTP requests, gọi Service
- **Service**: Chứa business logic
- **Repository**: Data access layer
- **Entity**: Database models
- **DTO**: Data Transfer Objects

## Security

- **Password**: Hash bằng BCrypt
- **JWT**: Token expiration 24 giờ
- **CORS**: Cho phép frontend từ localhost:5173

## Troubleshooting

### Lỗi kết nối Database
```
Kiểm tra PostgreSQL đã chạy chưa:
sudo systemctl status postgresql

Kiểm tra username/password trong application.yml
```

### Lỗi Port 8080 đã được sử dụng
```
Thay đổi port trong application.yml:
server:
  port: 8081
```

## License

MIT License - D4K Team 2025

