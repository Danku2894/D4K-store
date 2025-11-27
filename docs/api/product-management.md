# 🛍️ Product Management API

API endpoints để quản lý sản phẩm thời trang.

---

## 🔓 Public Endpoints (No Authentication Required)

### 1. Lấy tất cả products (Paginated)

```http
GET /api/v1/products?page=0&size=10&sortBy=createdAt&direction=desc
```

Trả về danh sách sản phẩm active (isActive = true) có phân trang.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Số trang |
| size | int | 10 | Số items/trang |
| sortBy | string | createdAt | Field để sort (name, price, createdAt) |
| direction | string | desc | Hướng sort (asc, desc) |

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/products?page=0&size=10"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Classic White Dress Shirt",
        "description": "Elegant white dress shirt for formal occasions",
        "price": 39.99,
        "stock": 50,
        "imageUrl": "https://via.placeholder.com/300x400?text=White+Shirt",
        "categoryId": 5,
        "categoryName": "Men's Shirts",
        "isActive": true,
        "inStock": true,
        "createdAt": "2025-11-27T10:00:00",
        "updatedAt": "2025-11-27T10:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 15,
    "totalPages": 2,
    "first": true,
    "last": false
  },
  "message": "Products retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

### 2. Lấy products theo category

```http
GET /api/v1/products/category/{categoryId}?page=0&size=10
```

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/products/category/5?page=0&size=10"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Classic White Dress Shirt",
        "categoryId": 5,
        "categoryName": "Men's Shirts",
        "price": 39.99,
        "stock": 50,
        "inStock": true
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 3,
    "totalPages": 1
  },
  "message": "Products retrieved successfully"
}
```

---

### 3. Tìm kiếm products

```http
GET /api/v1/products/search?keyword=shirt&page=0&size=10
```

Tìm kiếm trong name và description (case-insensitive).

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/products/search?keyword=shirt"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Classic White Dress Shirt",
        "description": "Elegant white dress shirt...",
        "price": 39.99
      },
      {
        "id": 2,
        "name": "Navy Blue Oxford Shirt",
        "price": 34.99
      }
    ]
  },
  "message": "Products search completed successfully"
}
```

---

### 4. Lấy chi tiết product

```http
GET /api/v1/products/{id}
```

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/products/1"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Classic White Dress Shirt",
    "description": "Elegant white dress shirt for formal occasions",
    "price": 39.99,
    "stock": 50,
    "imageUrl": "https://via.placeholder.com/300x400",
    "categoryId": 5,
    "categoryName": "Men's Shirts",
    "isActive": true,
    "inStock": true,
    "createdAt": "2025-11-27T10:00:00",
    "updatedAt": "2025-11-27T10:00:00"
  },
  "message": "Product retrieved successfully"
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "Product not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## 🔐 Admin Endpoints (ADMIN Role Required)

### 5. Lấy tất cả products (Admin - bao gồm inactive)

```http
GET /api/v1/admin/products?page=0&size=10
Authorization: Bearer {admin_token}
```

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

### 6. Tạo product mới

```http
POST /api/v1/admin/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Premium Leather Jacket",
  "description": "High-quality leather jacket",
  "price": 199.99,
  "stock": 25,
  "imageUrl": "https://example.com/jacket.jpg",
  "categoryId": 7,
  "isActive": true
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Tên product (3-200 ký tự) |
| description | string | No | Mô tả (max 2000 ký tự) |
| price | decimal | Yes | Giá (> 0, max 8 digits + 2 decimals) |
| stock | integer | Yes | Số lượng (>= 0) |
| imageUrl | string | No | URL hình ảnh (max 500 ký tự) |
| categoryId | long | Yes | ID category (phải tồn tại) |
| isActive | boolean | No | Trạng thái (default: true) |

#### Curl Command

```bash
curl -X POST "http://localhost:8080/api/v1/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Leather Jacket",
    "description": "High-quality leather jacket",
    "price": 199.99,
    "stock": 25,
    "imageUrl": "https://example.com/jacket.jpg",
    "categoryId": 7,
    "isActive": true
  }'
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 18,
    "name": "Premium Leather Jacket",
    "description": "High-quality leather jacket",
    "price": 199.99,
    "stock": 25,
    "imageUrl": "https://example.com/jacket.jpg",
    "categoryId": 7,
    "categoryName": "Men's Jackets",
    "isActive": true,
    "inStock": true,
    "createdAt": "2025-11-27T15:30:00",
    "updatedAt": "2025-11-27T15:30:00"
  },
  "message": "Product created successfully"
}
```

#### Error Responses

**Category not found (404 Not Found)**

```json
{
  "success": false,
  "message": "Category not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

**Invalid price (400 Bad Request)**

```json
{
  "success": false,
  "message": "Price must be greater than 0",
  "errorCode": "INVALID_PRICE"
}
```

**Invalid stock (400 Bad Request)**

```json
{
  "success": false,
  "message": "Stock cannot be negative",
  "errorCode": "INVALID_STOCK"
}
```

**Validation Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "name": "Product name is required",
    "price": "Price is required",
    "categoryId": "Category ID is required"
  },
  "errorCode": "VALIDATION_ERROR"
}
```

---

### 7. Cập nhật product

```http
PUT /api/v1/admin/products/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 149.99,
  "stock": 30,
  "imageUrl": "https://example.com/updated.jpg",
  "categoryId": 7,
  "isActive": true
}
```

#### Curl Command

```bash
curl -X PUT "http://localhost:8080/api/v1/admin/products/1" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product Name",
    "description": "Updated description",
    "price": 149.99,
    "stock": 30,
    "categoryId": 7,
    "isActive": true
  }'
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Product Name",
    "price": 149.99,
    "stock": 30,
    "updatedAt": "2025-11-27T15:35:00"
  },
  "message": "Product updated successfully"
}
```

---

### 8. Xóa product

```http
DELETE /api/v1/admin/products/{id}
Authorization: Bearer {admin_token}
```

#### Curl Command

```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/products/18" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "Product not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## 📋 Testing Flow

### Step 1: Get all products (Public)

```bash
curl -X GET "http://localhost:8080/api/v1/products"
```

### Step 2: Filter by category

```bash
# Get Men's Shirts (categoryId = 5)
curl -X GET "http://localhost:8080/api/v1/products/category/5"
```

### Step 3: Search products

```bash
curl -X GET "http://localhost:8080/api/v1/products/search?keyword=dress"
```

### Step 4: Login as Admin

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@d4k.com",
    "password": "admin123"
  }'

ADMIN_TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

### Step 5: Create product

```bash
curl -X POST "http://localhost:8080/api/v1/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 99.99,
    "stock": 10,
    "categoryId": 5
  }'

# Save product ID
PRODUCT_ID=18
```

### Step 6: Update product

```bash
curl -X PUT "http://localhost:8080/api/v1/admin/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test Product",
    "price": 89.99,
    "stock": 20,
    "categoryId": 5
  }'
```

### Step 7: Delete product

```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🎯 Use Cases

### 1. Product Listing Page

```javascript
// Fetch products with pagination
const response = await fetch('/api/v1/products?page=0&size=12');
const { data } = await response.json();

data.content.forEach(product => {
  console.log(`${product.name} - $${product.price}`);
  console.log(`Stock: ${product.stock} - ${product.inStock ? 'Available' : 'Out of Stock'}`);
});
```

### 2. Category Filter

```javascript
// Filter by category
const categoryId = 5; // Men's Shirts
const response = await fetch(`/api/v1/products/category/${categoryId}`);
const { data } = await response.json();
```

### 3. Search Functionality

```javascript
// Search products
const keyword = 'shirt';
const response = await fetch(`/api/v1/products/search?keyword=${keyword}`);
const { data } = await response.json();
```

### 4. Product Detail Page

```javascript
// Get product details
const productId = 1;
const response = await fetch(`/api/v1/products/${productId}`);
const { data } = await response.json();

console.log(data.name);
console.log(data.description);
console.log(`Category: ${data.categoryName}`);
```

---

## 🔒 Business Rules

1. **Price Validation**: Giá phải > 0
2. **Stock Validation**: Stock phải >= 0
3. **Category Required**: Phải thuộc một category hợp lệ
4. **Active Filter**: Public chỉ thấy products có isActive = true
5. **Stock Display**: inStock = true nếu stock > 0
6. **Soft Delete**: Nên set isActive = false thay vì xóa

---

## 📊 Database Schema

```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url VARCHAR(500),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_product_active ON products(is_active);
```

---

## 🚀 Performance Tips

1. **Use Pagination**: Luôn sử dụng page và size
2. **Index Usage**: Queries sử dụng indexes (category, name, isActive)
3. **Lazy Loading**: Category được lazy load để tối ưu performance
4. **Search Optimization**: LIKE queries với indexes
5. **Caching**: Consider caching category tree

---

**Happy Coding! 🛍️**

