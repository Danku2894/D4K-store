# 📂 Category Management API

API endpoints để quản lý categories cho sản phẩm thời trang.

---

## 🔓 Public Endpoints (No Authentication Required)

### 1. Lấy tất cả categories (Flat List)

```http
GET /api/v1/categories
```

Trả về danh sách tất cả categories dạng flat list (không có cấu trúc tree).

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/categories"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Men",
      "description": "Men's fashion and accessories",
      "parentId": null,
      "parentName": null,
      "createdAt": "2025-11-27T10:00:00",
      "updatedAt": "2025-11-27T10:00:00"
    },
    {
      "id": 5,
      "name": "Men's Shirts",
      "description": "Casual and formal shirts for men",
      "parentId": 1,
      "parentName": "Men",
      "createdAt": "2025-11-27T10:00:00",
      "updatedAt": "2025-11-27T10:00:00"
    }
  ],
  "message": "Categories retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

### 2. Lấy category tree (Hierarchical)

```http
GET /api/v1/categories/tree
```

Trả về categories dạng tree structure (parent-child hierarchy).

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/categories/tree"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Men",
      "description": "Men's fashion and accessories",
      "parentId": null,
      "parentName": null,
      "children": [
        {
          "id": 5,
          "name": "Men's Shirts",
          "description": "Casual and formal shirts for men",
          "parentId": 1,
          "parentName": "Men",
          "children": [],
          "createdAt": "2025-11-27T10:00:00",
          "updatedAt": "2025-11-27T10:00:00"
        },
        {
          "id": 6,
          "name": "Men's Pants",
          "description": "Trousers, jeans, and shorts",
          "parentId": 1,
          "parentName": "Men",
          "children": [],
          "createdAt": "2025-11-27T10:00:00",
          "updatedAt": "2025-11-27T10:00:00"
        }
      ],
      "createdAt": "2025-11-27T10:00:00",
      "updatedAt": "2025-11-27T10:00:00"
    }
  ],
  "message": "Category tree retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

### 3. Lấy chi tiết category theo ID

```http
GET /api/v1/categories/{id}
```

#### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/categories/1"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Men",
    "description": "Men's fashion and accessories",
    "parentId": null,
    "parentName": null,
    "createdAt": "2025-11-27T10:00:00",
    "updatedAt": "2025-11-27T10:00:00"
  },
  "message": "Category retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "Category not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

## 🔐 Admin Endpoints (ADMIN Role Required)

### 4. Tạo category mới

```http
POST /api/v1/admin/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Sportswear",
  "description": "Athletic and sports clothing",
  "parentId": null
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Tên category (2-100 ký tự, unique) |
| description | string | No | Mô tả (max 500 ký tự) |
| parentId | long | No | ID của parent category (null = root) |

#### Curl Command

```bash
curl -X POST "http://localhost:8080/api/v1/admin/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sportswear",
    "description": "Athletic and sports clothing",
    "parentId": null
  }'
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 17,
    "name": "Sportswear",
    "description": "Athletic and sports clothing",
    "parentId": null,
    "parentName": null,
    "createdAt": "2025-11-27T15:30:00",
    "updatedAt": "2025-11-27T15:30:00"
  },
  "message": "Category created successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

#### Error Responses

**Category name already exists (400 Bad Request)**

```json
{
  "success": false,
  "message": "Category name already exists",
  "errorCode": "CATEGORY_NAME_EXISTS",
  "timestamp": "2025-11-27T15:30:00"
}
```

**Parent category not found (404 Not Found)**

```json
{
  "success": false,
  "message": "Parent Category not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2025-11-27T15:30:00"
}
```

**Validation Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "name": "Category name is required",
    "description": "Description must not exceed 500 characters"
  },
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2025-11-27T15:30:00"
}
```

---

### 5. Cập nhật category

```http
PUT /api/v1/admin/categories/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Men's Fashion",
  "description": "Updated description",
  "parentId": null
}
```

#### Curl Command

```bash
curl -X PUT "http://localhost:8080/api/v1/admin/categories/1" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Men'\''s Fashion",
    "description": "Updated description",
    "parentId": null
  }'
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Men's Fashion",
    "description": "Updated description",
    "parentId": null,
    "parentName": null,
    "createdAt": "2025-11-27T10:00:00",
    "updatedAt": "2025-11-27T15:35:00"
  },
  "message": "Category updated successfully",
  "timestamp": "2025-11-27T15:35:00"
}
```

#### Error Responses

**Cannot set as own parent (400 Bad Request)**

```json
{
  "success": false,
  "message": "Cannot set category as its own parent",
  "errorCode": "INVALID_PARENT",
  "timestamp": "2025-11-27T15:35:00"
}
```

**Circular reference (400 Bad Request)**

```json
{
  "success": false,
  "message": "Cannot set parent as descendant",
  "errorCode": "CIRCULAR_REFERENCE",
  "timestamp": "2025-11-27T15:35:00"
}
```

---

### 6. Xóa category

```http
DELETE /api/v1/admin/categories/{id}
Authorization: Bearer {admin_token}
```

#### Curl Command

```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/categories/17" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "timestamp": "2025-11-27T15:40:00"
}
```

#### Error Responses

**Category has subcategories (400 Bad Request)**

```json
{
  "success": false,
  "message": "Cannot delete category with subcategories. Please delete subcategories first.",
  "errorCode": "CATEGORY_HAS_CHILDREN",
  "timestamp": "2025-11-27T15:40:00"
}
```

**Category not found (404 Not Found)**

```json
{
  "success": false,
  "message": "Category not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2025-11-27T15:40:00"
}
```

---

## 📋 Testing Flow

### Step 1: Get all categories (Public)

```bash
# Get flat list
curl -X GET "http://localhost:8080/api/v1/categories"

# Get tree structure
curl -X GET "http://localhost:8080/api/v1/categories/tree"
```

### Step 2: Login as Admin

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@d4k.com",
    "password": "admin123"
  }'

# Save token
ADMIN_TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

### Step 3: Create root category

```bash
curl -X POST "http://localhost:8080/api/v1/admin/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sports",
    "description": "Sports and outdoor gear",
    "parentId": null
  }'

# Save category ID from response
CATEGORY_ID=17
```

### Step 4: Create subcategory

```bash
curl -X POST "http://localhost:8080/api/v1/admin/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Running",
    "description": "Running shoes and apparel",
    "parentId": '$CATEGORY_ID'
  }'
```

### Step 5: Update category

```bash
curl -X PUT "http://localhost:8080/api/v1/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sports & Outdoor",
    "description": "Updated description",
    "parentId": null
  }'
```

### Step 6: Try to delete parent (should fail)

```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
# Should return error: Category has children
```

### Step 7: Delete children first, then parent

```bash
# Delete subcategory
curl -X DELETE "http://localhost:8080/api/v1/admin/categories/18" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Now delete parent
curl -X DELETE "http://localhost:8080/api/v1/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🗂️ Category Hierarchy Example

```
Men (root)
├── Men's Shirts
├── Men's Pants
├── Men's Jackets
└── Men's Shoes

Women (root)
├── Women's Dresses
├── Women's Tops
├── Women's Pants
└── Women's Shoes

Kids (root)
├── Boys
├── Girls
└── Baby

Accessories (root)
├── Bags
├── Jewelry
├── Watches
└── Belts
```

---

## 🔒 Business Rules

1. **Unique Names**: Category names phải unique trong toàn bộ hệ thống
2. **No Self-Reference**: Category không thể là parent của chính nó
3. **No Circular Reference**: Không cho phép A → B → C → A
4. **Delete Restriction**: Không thể xóa category có subcategories
5. **Parent Validation**: Parent category phải tồn tại trong database
6. **Hierarchy Depth**: Không giới hạn độ sâu của tree (có thể cấu hình sau)

---

## 📊 Database Schema

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_category_parent ON categories(parent_id);
CREATE INDEX idx_category_name ON categories(name);
```

---

## 🎯 Use Cases

### Frontend Use Cases

1. **Navigation Menu**: Display category tree cho menu
2. **Product Filter**: Filter products by category
3. **Breadcrumb**: Show category hierarchy trong product detail
4. **Admin Panel**: CRUD categories

### Example: Display Category Menu

```javascript
// Fetch category tree
const response = await fetch('/api/v1/categories/tree');
const { data } = await response.json();

// Render menu
data.forEach(category => {
  console.log(category.name); // Men
  category.children?.forEach(sub => {
    console.log('  -', sub.name); // Men's Shirts
  });
});
```

---

## 🚀 Best Practices

1. **Use Tree Endpoint**: Sử dụng `/categories/tree` cho navigation menu
2. **Cache Categories**: Categories ít thay đổi, nên cache ở frontend
3. **Validate Parent**: Luôn validate parentId trước khi create/update
4. **Delete Children First**: Xóa subcategories trước khi xóa parent
5. **Test Circular Reference**: Test kỹ scenario circular reference

---

**Happy Coding! 🚀**

