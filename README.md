# 🛍️ D4K E-commerce - Fashion Store

Dự án Website bán hàng thời trang online với kiến trúc **Clean Architecture** và **Scalable Design**.

## 📋 Mô tả dự án

Website E-commerce thời trang với 2 role chính:
- **USER**: Khách hàng - xem, tìm kiếm, mua sản phẩm, đánh giá
- **ADMIN**: Quản trị viên - quản lý toàn bộ hệ thống

## 🏗️ Tech Stack

### Frontend
- **Framework**: ReactJS 18+ với TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand / Redux Toolkit
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form + Zod
- **Routing**: React Router v6

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL 15+
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

## 🚀 Tính năng chính

✅ **Đã hoàn thành:**
- [x] Authentication & Authorization (JWT)
  - Đăng ký tài khoản
  - Đăng nhập
  - Quản lý token

🔄 **Đang phát triển:**
- [ ] Product Management (CRUD sản phẩm, danh mục, variants)
- [ ] Cart & Wishlist
- [ ] Order & Payment Management
- [ ] Reviews & Ratings
- [ ] Promotions / Coupons
- [ ] Admin Dashboard / Analytics

## 📁 Cấu trúc Project

```
d4k-ecommerce/
├── frontend/                  # ReactJS Application
│   ├── src/
│   │   ├── components/       # Atomic Design (atoms, molecules, organisms)
│   │   ├── features/         # Feature-based modules
│   │   ├── pages/            # Page components
│   │   ├── shared/           # Shared utilities (api, hooks, utils)
│   │   └── guards/           # Route guards
│   └── package.json
│
├── backend/                   # Spring Boot Application
│   ├── src/main/java/com/d4k/ecommerce/
│   │   ├── config/           # Configuration classes
│   │   ├── common/           # Shared code (exception, response, constants)
│   │   ├── security/         # Security & JWT
│   │   └── modules/          # Feature modules (auth, user, product, etc.)
│   ├── src/main/resources/
│   │   ├── application.yml   # Application config
│   │   └── db/migration/     # Database migrations
│   └── pom.xml
│
├── database/                  # Database scripts & seeds
├── docs/                      # Documentation
└── README.md
```

## 🔧 Setup & Installation

### Prerequisites
- **Node.js** 18+ và npm/yarn
- **Java** 17+
- **Maven** 3.8+
- **PostgreSQL** 15+
- **Git**

### 1. Clone Repository

```bash
git clone <repository-url>
cd d4k-ecommerce
```

### 2. Setup Database

```sql
-- Tạo database
CREATE DATABASE d4k_ecommerce;
```

### 3. Setup Backend

```bash
cd backend

# Cập nhật database config trong application.yml
# spring.datasource.url
# spring.datasource.username
# spring.datasource.password

# Build và chạy
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### 4. Setup Frontend (Coming Soon)

```bash
cd frontend

# Install dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 📖 API Documentation

### Authentication Endpoints

#### 1. Đăng ký tài khoản
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

#### 2. Đăng nhập
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
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
      "fullName": "Nguyen Van A",
      "email": "nguyenvana@example.com",
      "role": "USER"
    }
  },
  "message": "Login successful"
}
```

### Swagger UI

Truy cập API documentation đầy đủ tại:
```
http://localhost:8080/swagger-ui/index.html
```

## 🏛️ Architecture

### Clean Architecture Principles

```
Presentation Layer (Controller)
    ↓
Business Logic Layer (Service)
    ↓
Data Access Layer (Repository)
    ↓
Database (Entity)
```

**Nguyên tắc:**
- ✅ Separation of Concerns
- ✅ Dependency Rule (dependencies đi từ ngoài vào trong)
- ✅ SOLID Principles
- ✅ DRY (Don't Repeat Yourself)

### Backend Layers

1. **Controller**: Nhận HTTP requests, trả về responses
2. **Service**: Chứa business logic, validation
3. **Repository**: Data access (JPA)
4. **Entity**: Database models
5. **DTO**: Data Transfer Objects (Request/Response)

### Frontend Structure (Planned)

1. **Components**: Atomic Design (atoms → molecules → organisms → templates)
2. **Features**: Feature-based modules (auth, products, cart, etc.)
3. **Pages**: Route handlers
4. **Shared**: Common utilities, hooks, API client

## 🔐 Security

- **Password Hashing**: BCrypt
- **Authentication**: JWT (JSON Web Token)
- **Token Expiration**: 24 giờ
- **CORS**: Configured cho localhost development
- **Input Validation**: Bean Validation (Jakarta)

## 📝 Coding Standards

### Naming Convention

| Type | Convention | Example |
|------|-----------|---------|
| File/Folder | kebab-case | `auth-controller.java` |
| Class/Component | PascalCase | `AuthController`, `UserService` |
| Variable/Method | camelCase | `getUserById`, `totalPrice` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

### Code Style

- **Backend**: Java Code Conventions, Spring Boot Best Practices
- **Frontend**: Airbnb JavaScript Style Guide, React Best Practices
- **Comment**: Tiếng Việt hoặc Tiếng Anh (nhất quán trong từng file)

## 🧪 Testing

```bash
# Backend tests
cd backend
mvn test

# Frontend tests (Coming soon)
cd frontend
npm test
```

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md) _(Coming soon)_
- [Database Schema](./database/README.md) _(Coming soon)_
- [Deployment Guide](./docs/guides/deployment-guide.md) _(Coming soon)_

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

- **Team**: D4K Development Team
- **Email**: contact@d4k.com
- **Project Link**: [GitHub Repository]

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Note**: Dự án đang trong giai đoạn phát triển. Authentication module đã hoàn thành, các module khác đang được phát triển.

_Last updated: November 27, 2025_

