# 🛒 Cart Management API

API endpoints để quản lý giỏ hàng (yêu cầu authentication).

---

## 🔐 Authentication Required

Tất cả endpoints trong tài liệu này yêu cầu:
- **JWT Token** trong Authorization header
- **Authenticated User** (USER hoặc ADMIN role)

```http
Authorization: Bearer {user_token}
```

---

## 1. Lấy giỏ hàng

```http
GET /api/v1/cart
Authorization: Bearer {token}
```

Lấy giỏ hàng của user hiện tại.

### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/cart" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "items": [
      {
        "id": 1,
        "productId": 5,
        "productName": "Classic White Dress Shirt",
        "productPrice": 39.99,
        "productImageUrl": "https://via.placeholder.com/300x400",
        "quantity": 2,
        "subtotal": 79.98,
        "available": true
      },
      {
        "id": 2,
        "productId": 3,
        "productName": "Slim Fit Jeans",
        "productPrice": 49.99,
        "productImageUrl": "https://via.placeholder.com/300x400",
        "quantity": 1,
        "subtotal": 49.99,
        "available": true
      }
    ],
    "totalItems": 2,
    "totalAmount": 129.97
  },
  "message": "Cart retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

### Empty Cart Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "items": [],
    "totalItems": 0,
    "totalAmount": 0.00
  },
  "message": "Cart retrieved successfully"
}
```

---

## 2. Thêm sản phẩm vào giỏ hàng

```http
POST /api/v1/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 5,
  "quantity": 2
}
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | long | Yes | ID của product |
| quantity | integer | Yes | Số lượng (>= 1) |

### Curl Command

```bash
curl -X POST "http://localhost:8080/api/v1/cart/add" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 5,
    "quantity": 2
  }'
```

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "items": [
      {
        "id": 1,
        "productId": 5,
        "productName": "Classic White Dress Shirt",
        "productPrice": 39.99,
        "quantity": 2,
        "subtotal": 79.98,
        "available": true
      }
    ],
    "totalItems": 1,
    "totalAmount": 79.98
  },
  "message": "Product added to cart successfully"
}
```

### Error Responses

**Product not found (404 Not Found)**

```json
{
  "success": false,
  "message": "Product not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

**Insufficient stock (400 Bad Request)**

```json
{
  "success": false,
  "message": "Insufficient stock. Only 5 items available",
  "errorCode": "INSUFFICIENT_STOCK"
}
```

**Product not available (400 Bad Request)**

```json
{
  "success": false,
  "message": "Product is not available",
  "errorCode": "PRODUCT_NOT_AVAILABLE"
}
```

**Validation Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "productId": "Product ID is required",
    "quantity": "Quantity must be at least 1"
  },
  "errorCode": "VALIDATION_ERROR"
}
```

---

## 3. Cập nhật số lượng cart item

```http
PUT /api/v1/cart/update/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quantity | integer | Yes | Số lượng mới (>= 1) |

### Curl Command

```bash
curl -X PUT "http://localhost:8080/api/v1/cart/update/1" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "items": [
      {
        "id": 1,
        "productId": 5,
        "quantity": 3,
        "subtotal": 119.97,
        "available": true
      }
    ],
    "totalItems": 1,
    "totalAmount": 119.97
  },
  "message": "Cart item updated successfully"
}
```

### Error Responses

**Cart item not found (404 Not Found)**

```json
{
  "success": false,
  "message": "Cart item not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

**Insufficient stock (400 Bad Request)**

```json
{
  "success": false,
  "message": "Insufficient stock. Only 2 items available",
  "errorCode": "INSUFFICIENT_STOCK"
}
```

---

## 4. Xóa item khỏi giỏ hàng

```http
DELETE /api/v1/cart/remove/{itemId}
Authorization: Bearer {token}
```

### Curl Command

```bash
curl -X DELETE "http://localhost:8080/api/v1/cart/remove/1" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "items": [],
    "totalItems": 0,
    "totalAmount": 0.00
  },
  "message": "Cart item removed successfully"
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "Cart item not found with id: '999'",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## 5. Xóa toàn bộ giỏ hàng

```http
DELETE /api/v1/cart/clear
Authorization: Bearer {token}
```

### Curl Command

```bash
curl -X DELETE "http://localhost:8080/api/v1/cart/clear" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "timestamp": "2025-11-27T15:40:00"
}
```

---

## 📋 Testing Flow

### Step 1: Register và Login

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Save token
USER_TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

### Step 2: Get empty cart

```bash
curl -X GET "http://localhost:8080/api/v1/cart" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Step 3: Add products to cart

```bash
# Add product 1
curl -X POST "http://localhost:8080/api/v1/cart/add" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'

# Add product 2
curl -X POST "http://localhost:8080/api/v1/cart/add" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 3, "quantity": 1}'
```

### Step 4: Update quantity

```bash
# Get cart to see item IDs
curl -X GET "http://localhost:8080/api/v1/cart" \
  -H "Authorization: Bearer $USER_TOKEN"

# Update item quantity
ITEM_ID=1
curl -X PUT "http://localhost:8080/api/v1/cart/update/$ITEM_ID" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

### Step 5: Remove item

```bash
curl -X DELETE "http://localhost:8080/api/v1/cart/remove/$ITEM_ID" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Step 6: Clear cart

```bash
curl -X DELETE "http://localhost:8080/api/v1/cart/clear" \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

## 🎯 Business Rules

1. **One Cart Per User**: Mỗi user chỉ có 1 cart
2. **Unique Products**: Một product chỉ xuất hiện 1 lần trong cart (update quantity nếu add lại)
3. **Stock Validation**: Kiểm tra stock availability khi add/update
4. **Quantity Validation**: Quantity phải >= 1
5. **Auto Create**: Cart tự động được tạo khi user add item lần đầu
6. **User Isolation**: User chỉ có thể access cart của mình
7. **Availability Check**: Response include field `available` để check product còn stock không

---

## 💡 Frontend Integration

### Example: Add to Cart

```javascript
async function addToCart(productId, quantity) {
  const response = await fetch('/api/v1/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  
  const { data } = await response.json();
  console.log(`Cart has ${data.totalItems} items`);
  console.log(`Total: $${data.totalAmount}`);
}
```

### Example: Update Cart Item

```javascript
async function updateQuantity(itemId, quantity) {
  const response = await fetch(`/api/v1/cart/update/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ quantity })
  });
  
  const { data } = await response.json();
  return data;
}
```

### Example: Display Cart

```javascript
async function displayCart() {
  const response = await fetch('/api/v1/cart', {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  const { data } = await response.json();
  
  data.items.forEach(item => {
    console.log(`${item.productName} x ${item.quantity} = $${item.subtotal}`);
    if (!item.available) {
      console.warn('⚠️ Out of stock!');
    }
  });
  
  console.log(`Total: $${data.totalAmount}`);
}
```

---

## 📊 Database Schema

```sql
CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    UNIQUE (cart_id, product_id)
);

-- Indexes
CREATE INDEX idx_cart_user ON carts(user_id);
CREATE INDEX idx_cart_item_cart ON cart_items(cart_id);
```

---

## 🚀 Best Practices

1. **Check Availability**: Frontend nên check `available` field trước checkout
2. **Handle Stock Changes**: Stock có thể thay đổi giữa add và checkout
3. **Show Total**: Luôn hiển thị `totalAmount` cho user
4. **Loading States**: Show loading khi add/update/remove items
5. **Error Handling**: Handle stock errors gracefully
6. **Auto Refresh**: Refresh cart sau mỗi operation
7. **Cart Badge**: Display `totalItems` on cart icon

---

**Happy Shopping! 🛒**

