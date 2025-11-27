# Backend Missing Features Checklist

**Last Updated**: November 27, 2025  
**Current Completion**: 9/10 Core Modules (90%)

---

## 🔴 CRITICAL - Core Features (Cần Implement Ngay)

### 1. Order Management Module ⚠️ **HIGHEST PRIORITY**
**Status**: ❌ Not Started  
**Impact**: Blocking nhiều features khác (Payment, Analytics, Review validation, Coupon usage)

**Cần Implement:**
- [ ] `Order` entity với các fields:
  - id, userId, orderNumber, status, totalAmount, shippingAddress
  - paymentMethod, paymentStatus, note
  - createdAt, updatedAt, completedAt
- [ ] `OrderItem` entity:
  - id, orderId, productId, quantity, price, subtotal
- [ ] `OrderStatus` enum: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- [ ] `PaymentStatus` enum: PENDING, PAID, FAILED, REFUNDED
- [ ] `OrderRepository` với queries:
  - findByUserId, findByStatus, findByOrderNumber
  - Revenue calculations (sum, by month, by year)
  - Top selling products queries
- [ ] `OrderService` implementation:
  - createOrder (from cart)
  - updateOrderStatus
  - cancelOrder
  - calculateTotal
  - Stock deduction logic
- [ ] `OrderController` (USER endpoints):
  - POST /orders - Tạo order từ cart
  - GET /orders - List orders của user
  - GET /orders/{id} - Chi tiết order
  - PUT /orders/{id}/cancel - Hủy order
- [ ] `AdminOrderController` (ADMIN endpoints):
  - GET /admin/orders - List tất cả orders
  - GET /admin/orders/{id} - Chi tiết
  - PUT /admin/orders/{id}/status - Update status
  - GET /admin/orders/stats - Statistics
- [ ] Database migrations:
  - V13__create_orders_table.sql
  - V14__create_order_items_table.sql
  - V15__seed_sample_orders.sql
- [ ] Transaction management (order + stock update atomic)
- [ ] Validation: stock availability, user authentication
- [ ] API documentation

**Dependencies Blocked By This:**
- ✅ Dashboard revenue stats
- ✅ Review purchase validation
- ✅ Coupon usage count auto-increment
- ✅ Sales analytics
- ✅ Top products calculation

---

### 2. Payment Integration Module
**Status**: ❌ Not Started  
**Priority**: High (nhưng có thể implement sau Order)

**Cần Implement:**
- [ ] `Payment` entity:
  - id, orderId, amount, paymentMethod, status
  - transactionId, paymentDate
- [ ] Payment Gateway Integration:
  - [ ] VNPay service (Vietnam popular)
  - [ ] MoMo service (E-wallet)
  - [ ] COD (Cash on Delivery) - Simple
- [ ] `PaymentService`:
  - createPayment
  - processPayment
  - verifyPayment
  - handleCallback/Webhook
- [ ] `PaymentController`:
  - POST /payments/create
  - GET /payments/{id}
  - POST /payments/vnpay/callback
  - POST /payments/momo/callback
- [ ] Payment flow:
  1. User checkout → Create Order (PENDING)
  2. Redirect to payment gateway
  3. Callback → Update payment status
  4. Update order status based on payment
- [ ] Database migration
- [ ] API documentation

**Note**: COD có thể implement đơn giản trước, payment gateway sau.

---

## 🟡 IMPORTANT - Secondary Features

### 3. User Profile Management
**Status**: ⚠️ Partially Done  
**Current**: Admin có thể update users, nhưng USER chưa có endpoint tự update profile

**Còn Thiếu:**
- [ ] `UserController` (USER endpoints):
  - GET /users/profile - Lấy profile của mình
  - PUT /users/profile - Update profile (fullName, email)
  - PUT /users/change-password - Đổi password
  - POST /users/addresses - Thêm address
  - GET /users/addresses - List addresses
  - PUT /users/addresses/{id} - Update address
  - DELETE /users/addresses/{id} - Xóa address
  - PUT /users/addresses/{id}/default - Set default address
- [ ] `Address` entity (nếu chưa có):
  - id, userId, fullName, phone, address, city, district, ward
  - isDefault, createdAt, updatedAt
- [ ] Validation: Email unique check khi update, password strength
- [ ] API documentation

**Current Workaround**: Admin có thể update qua Admin endpoints, nhưng user không tự update được.

---

### 4. Authentication Enhancements
**Status**: ⚠️ Basic Done, Missing Advanced Features

**Còn Thiếu:**
- [ ] Forgot Password Flow:
  - POST /auth/forgot-password (send email with reset token)
  - POST /auth/reset-password (with token)
  - Password reset token entity/storage
- [ ] Refresh Token:
  - POST /auth/refresh (get new access token)
  - RefreshToken entity (userId, token, expiresAt)
  - Token rotation security
- [ ] Email Verification:
  - Send verification email on register
  - GET /auth/verify-email?token=xxx
  - User.isEmailVerified field
- [ ] Account Lock/Unlock (Admin):
  - PUT /admin/users/{id}/lock
  - PUT /admin/users/{id}/unlock

**Current**: Chỉ có basic login/register với JWT.

---

### 5. Email/Notification Service
**Status**: ❌ Not Implemented

**Cần Implement:**
- [ ] Email Service Infrastructure:
  - SMTP configuration
  - Email templates (Thymeleaf/Freemarker)
  - `EmailService` interface
- [ ] Email Templates:
  - Welcome email (after registration)
  - Order confirmation
  - Order status update
  - Password reset
  - Promotional emails
- [ ] Email Sending:
  - Async processing (với @Async)
  - Retry mechanism
  - Email queue (optional)
- [ ] Dependencies: spring-boot-starter-mail
- [ ] Configuration: SMTP settings in application.yml

**Note**: Có thể dùng fake SMTP (MailHog, Mailtrap) cho development.

---

### 6. Inventory/Stock Management
**Status**: ⚠️ Basic Stock Tracking Only

**Current**: Products có stock field, cart validates stock.

**Còn Thiếu:**
- [ ] `StockHistory` entity:
  - id, productId, changeType, quantity, reason, userId, createdAt
  - Types: PURCHASE, SALE, ADJUSTMENT, RETURN
- [ ] `InventoryService`:
  - Track stock changes
  - Low stock alerts
  - Stock reports
- [ ] Admin Endpoints:
  - GET /admin/inventory - Stock overview
  - POST /admin/inventory/adjust - Manual adjustment
  - GET /admin/inventory/history - Stock history
  - GET /admin/inventory/low-stock - Low stock alert
- [ ] Auto stock deduction on order completion
- [ ] Stock reservation during checkout

**Current Limitation**: Stock chỉ là số, không có history tracking.

---

## 🟢 NICE TO HAVE - Enhancement Features

### 7. File Upload Service
**Status**: ❌ Not Implemented

**Cần Implement:**
- [ ] File Upload Infrastructure:
  - Local storage or Cloud (Cloudinary, AWS S3)
  - `FileStorageService` interface
  - Max file size validation
  - Allowed file types (images only)
- [ ] Image Processing:
  - Resize/optimize images
  - Generate thumbnails
  - Multiple sizes (small, medium, large)
- [ ] Endpoints:
  - POST /upload/images - Upload single image
  - POST /upload/images/multiple - Upload multiple
  - DELETE /upload/images/{filename}
- [ ] Product Image Management:
  - Multiple images per product
  - `ProductImage` entity (if not exists)
  - Primary image selection

**Current**: Products chỉ có imageUrl (string), admin phải paste URL manually.

---

### 8. Advanced Product Features
**Status**: ⚠️ Basic Product Done

**Còn Thiếu:**
- [ ] Product Variants:
  - `ProductVariant` entity: size, color, sku, price, stock
  - Variant selection in cart/order
- [ ] Product Attributes:
  - `ProductAttribute` entity: material, brand, origin
  - Flexible attribute system
- [ ] Product Collections/Tags:
  - Tag system for filtering
  - Featured products
  - New arrivals
  - Best sellers flags

**Current**: Products chỉ có basic fields, không có variants.

---

### 9. Advanced Admin Features
**Status**: ⚠️ Basic Admin Done

**Còn Thiếu:**
- [ ] Bulk Operations:
  - Bulk update products
  - Bulk delete
  - Bulk status change
- [ ] Import/Export:
  - Export products to CSV
  - Import products from CSV
  - Export orders to Excel
- [ ] Activity Log:
  - Track admin actions
  - `AdminLog` entity
  - WHO did WHAT and WHEN
- [ ] Settings Management:
  - Site settings (name, logo, contact)
  - Shipping fee configuration
  - Tax configuration

---

### 10. Advanced Search & Filter
**Status**: ⚠️ Basic Search Done

**Còn Thiếu:**
- [ ] Full-Text Search:
  - PostgreSQL full-text search
  - Or Elasticsearch integration
- [ ] Advanced Filters:
  - Price range (min-max)
  - Multiple categories
  - Brands, colors, sizes
  - Sort by: price, popularity, rating, newest
- [ ] Search Suggestions:
  - Autocomplete
  - Popular searches
  - Related products

**Current**: Chỉ có basic keyword search.

---

### 11. Advanced Analytics
**Status**: ⚠️ Basic Dashboard Done

**Còn Thiếu:**
- [ ] Customer Analytics:
  - Customer lifetime value
  - Repeat purchase rate
  - Customer segmentation
- [ ] Product Analytics:
  - Product performance
  - Category performance
  - Slow-moving products
- [ ] Marketing Analytics:
  - Coupon performance
  - Campaign ROI
  - Conversion funnel
- [ ] Export Reports:
  - PDF reports
  - Excel reports
  - Scheduled reports via email

---

## 📊 Priority Matrix

### Must Have (Phase 1 - Core E-commerce)
```
1. ⚠️ Order Management      [BLOCKING OTHERS]
2. 🟡 User Profile (USER)   [UX Important]
3. 🟡 Payment Integration   [After Orders]
```

### Should Have (Phase 2 - Enhanced Experience)
```
4. Email Service
5. Forgot Password
6. Inventory Management
7. File Upload
```

### Nice to Have (Phase 3 - Advanced Features)
```
8. Product Variants
9. Advanced Search
10. Advanced Analytics
11. Bulk Operations
12. Activity Logs
```

---

## 🎯 Recommended Implementation Order

### Sprint 1 (Week 1-2): Core Commerce
```
✅ DONE: Auth, Products, Cart, Wishlist, Reviews, Coupons
🎯 TODO:
  1. Order Management (5-7 days)
     - Order entity & repository
     - Order service logic
     - USER endpoints
     - ADMIN endpoints
     - Database migrations
     - API documentation
     - Integration testing
  
  2. Basic User Profile (1-2 days)
     - Profile endpoints
     - Change password
     - Address management
```

### Sprint 2 (Week 3): Payment & Notifications
```
  3. Payment Integration (3-5 days)
     - COD first (simple)
     - VNPay integration
     - Payment callbacks
     
  4. Email Service (2-3 days)
     - SMTP setup
     - Order confirmation emails
     - Welcome emails
```

### Sprint 3 (Week 4): Polish & Enhancements
```
  5. Forgot Password (1 day)
  6. Inventory Management (2 days)
  7. File Upload (2 days)
  8. Advanced Analytics integration with Orders
  9. Testing & Bug fixes
  10. Documentation update
```

---

## 📋 Current Backend Statistics

### ✅ Completed (9/10 Core Modules - 90%)
- Authentication & Authorization ✅
- User Management (Admin) ✅
- Category Management ✅
- Product Management ✅
- Cart Management ✅
- Wishlist Management ✅
- Review Management ✅
- Coupon/Promotion Management ✅
- Dashboard/Analytics (Partial) ✅

### ⏳ In Progress
- None

### ❌ Not Started (Critical)
- Order Management ❌ **[BLOCKING]**
- Payment Integration ❌

### ⚠️ Partially Done
- User Profile (Admin có, User chưa)
- Authentication (Basic có, Advanced chưa)
- Inventory (Stock có, History chưa)
- Analytics (Structure có, Order data chưa)

---

## 🚀 Quick Start: Next Steps

### Immediate Actions (Today/Tomorrow)
1. **Start Order Module** - Đây là blocker lớn nhất
   - Create entities (Order, OrderItem)
   - Create enums (OrderStatus, PaymentStatus)
   - Basic repository
   - Service skeleton

### This Week
2. Complete Order CRUD operations
3. Integrate with Cart (checkout flow)
4. Add stock deduction logic
5. Basic testing

### Next Week
6. Payment COD first
7. User profile endpoints
8. Email service setup

---

## 💡 Notes & Recommendations

### For Order Module Implementation
- Start with simple COD payment
- Implement transaction management carefully
- Stock deduction should be atomic
- Order number generation (unique)
- Consider order states carefully

### For Payment Integration
- COD first (no external API)
- Then VNPay (popular in Vietnam)
- MoMo can be later
- Test payment callbacks thoroughly

### For Database
- Ensure proper indexes
- Foreign key constraints
- Consider order table partitioning if scaling

### For Security
- Order ownership validation
- Payment verification
- Transaction integrity

---

## 📞 Questions to Clarify

1. **Payment Methods**: COD only first, or need VNPay immediately?
2. **Shipping**: Fixed fee, or calculation based on location?
3. **Tax**: Need tax calculation?
4. **Multiple Addresses**: User có thể có nhiều addresses?
5. **Guest Checkout**: Allow checkout without login?

---

**Summary**: Backend đã hoàn thành 90% core features. **Order Management** là missing piece lớn nhất và đang block nhiều features khác. Recommendation: Focus 100% vào Order module trong 1 tuần tới.

---

**Prepared by**: D4K Development Team  
**Date**: November 27, 2025  
**Status**: Ready for Sprint Planning

