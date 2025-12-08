# D4K Store - E-Commerce Platform

![D4K Store](https://img.shields.io/badge/D4K-Store-red?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)

## 📖 Mô tả

**D4K Store** là một nền tảng thương mại điện tử full-stack hiện đại, được thiết kế với phong cách Street/Y2K độc đáo. Dự án bao gồm backend REST API được xây dựng bằng Spring Boot và frontend SPA sử dụng React + Vite.

## ✨ Tính năng chính

### 🛒 Quản lý sản phẩm
- Danh mục sản phẩm phân cấp
- Tìm kiếm và lọc sản phẩm
- Phân trang và sắp xếp
- Quản lý variants (màu sắc, kích thước)

### 🛍️ Giỏ hàng & Thanh toán
- Thêm/xóa sản phẩm vào giỏ
- Áp dụng mã giảm giá (Coupon)
- Tính phí vận chuyển
- Thanh toán COD & MoMo

### 🎯 Hệ thống Recommendation
- **Similar Products**: Đề xuất sản phẩm cùng danh mục
- **Popular Products**: Sản phẩm bán chạy nhất

### 👤 Quản lý người dùng
- Đăng ký/Đăng nhập với JWT
- Quản lý profile
- Danh sách yêu thích (Wishlist)
- Lịch sử đơn hàng

### 📊 Admin Dashboard
- Quản lý sản phẩm, danh mục
- Quản lý đơn hàng
- Thống kê doanh thu
- Quản lý người dùng

## 🏗️ Kiến trúc

```
D4K-store/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/d4k/ecommerce/
│   │       ├── common/          # Common utilities, responses
│   │       ├── config/          # App configuration
│   │       ├── modules/         # Feature modules
│   │       │   ├── product/     # Product management
│   │       │   ├── order/       # Order processing
│   │       │   ├── user/        # User management
│   │       │   ├── cart/        # Shopping cart
│   │       │   ├── promotion/   # Coupons & promotions
│   │       │   ├── recommendation/  # AI Recommendations
│   │       │   └── ...
│   │       └── security/        # JWT authentication
│   └── src/main/resources/
│       └── application.yml
│
├── frontend/                # React + Vite SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand state management
│   │   └── ...
│   └── package.json
│
└── README.md
```

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend

```bash
cd backend

# Cấu hình database trong application.yml
cp src/main/resources/application.example.yml src/main/resources/application.yml

# Chạy ứng dụng
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT
- **Database**: MySQL + JPA/Hibernate
- **Build**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **HTTP Client**: Axios
- **Icons**: React Icons

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Danku** - D4K Store

---

