# ❤️ Wishlist Management API

API endpoints để quản lý danh sách yêu thích (yêu cầu authentication).

---

## 🔐 Authentication Required

Tất cả endpoints yêu cầu JWT Token:

```http
Authorization: Bearer {user_token}
```

---

## 1. Lấy wishlist

```http
GET /api/v1/wishlist
Authorization: Bearer {token}
```

Lấy danh sách yêu thích của user hiện tại.

### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/wishlist" \
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
        "productStock": 50,
        "available": true,
        "addedAt": "2025-11-27T14:30:00"
      },
      {
        "id": 2,
        "productId": 7,
        "productName": "Elegant Evening Gown",
        "productPrice": 129.99,
        "productImageUrl": "https://via.placeholder.com/300x400",
        "productStock": 0,
        "available": false,
        "addedAt": "2025-11-27T15:00:00"
      }
    ],
    "totalItems": 2
  },
  "message": "Wishlist retrieved successfully",
  "timestamp": "2025-11-27T15:30:00"
}
```

### Empty Wishlist Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "items": [],
    "totalItems": 0
  },
  "message": "Wishlist retrieved successfully"
}
```

---

## 2. Thêm sản phẩm vào wishlist

```http
POST /api/v1/wishlist/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 5
}
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | long | Yes | ID của product |

### Curl Command

```bash
curl -X POST "http://localhost:8080/api/v1/wishlist/add" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 5
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
        "productImageUrl": "https://via.placeholder.com/300x400",
        "productStock": 50,
        "available": true,
        "addedAt": "2025-11-27T15:30:00"
      }
    ],
    "totalItems": 1
  },
  "message": "Product added to wishlist successfully"
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

**Product already in wishlist (400 Bad Request)**

```json
{
  "success": false,
  "message": "Product already in wishlist",
  "errorCode": "PRODUCT_ALREADY_IN_WISHLIST"
}
```

---

## 3. Xóa sản phẩm khỏi wishlist

```http
DELETE /api/v1/wishlist/remove/{productId}
Authorization: Bearer {token}
```

### Curl Command

```bash
curl -X DELETE "http://localhost:8080/api/v1/wishlist/remove/5" \
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
    "totalItems": 0
  },
  "message": "Product removed from wishlist successfully"
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "message": "Wishlist item not found with productId: '999'",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## 4. Xóa toàn bộ wishlist

```http
DELETE /api/v1/wishlist/clear
Authorization: Bearer {token}
```

### Curl Command

```bash
curl -X DELETE "http://localhost:8080/api/v1/wishlist/clear" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Wishlist cleared successfully",
  "timestamp": "2025-11-27T15:40:00"
}
```

---

## 5. Kiểm tra product có trong wishlist không

```http
GET /api/v1/wishlist/check/{productId}
Authorization: Bearer {token}
```

Useful để hiển thị heart icon (filled/outline) trên product card.

### Curl Command

```bash
curl -X GET "http://localhost:8080/api/v1/wishlist/check/5" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Success Response (200 OK)

**Product in wishlist:**
```json
{
  "success": true,
  "data": true,
  "message": "Product is in wishlist"
}
```

**Product not in wishlist:**
```json
{
  "success": true,
  "data": false,
  "message": "Product is not in wishlist"
}
```

---

## 📋 Testing Flow

### Step 1: Register và Login

```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

USER_TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

### Step 2: Get empty wishlist

```bash
curl -X GET "http://localhost:8080/api/v1/wishlist" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Step 3: Add products to wishlist

```bash
# Add product 1
curl -X POST "http://localhost:8080/api/v1/wishlist/add" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'

# Add product 2
curl -X POST "http://localhost:8080/api/v1/wishlist/add" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 5}'

# Try to add product 1 again (should fail - already in wishlist)
curl -X POST "http://localhost:8080/api/v1/wishlist/add" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'
```

### Step 4: Check if product in wishlist

```bash
# Check product 1 (should return true)
curl -X GET "http://localhost:8080/api/v1/wishlist/check/1" \
  -H "Authorization: Bearer $USER_TOKEN"

# Check product 99 (should return false)
curl -X GET "http://localhost:8080/api/v1/wishlist/check/99" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Step 5: Remove product

```bash
curl -X DELETE "http://localhost:8080/api/v1/wishlist/remove/1" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Step 6: Clear wishlist

```bash
curl -X DELETE "http://localhost:8080/api/v1/wishlist/clear" \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

## 🎯 Business Rules

1. **One Wishlist Per User**: Mỗi user chỉ có 1 wishlist
2. **Unique Products**: Một product chỉ xuất hiện 1 lần (no duplicates)
3. **Auto Create**: Wishlist tự động được tạo khi user add item lần đầu
4. **User Isolation**: User chỉ có thể access wishlist của mình
5. **Product Availability**: Response include `available` field (isActive && stock > 0)
6. **No Quantity**: Wishlist không có quantity (khác với Cart)

---

## 💡 Frontend Integration

### Example: Toggle Wishlist (Heart Icon)

```javascript
async function toggleWishlist(productId) {
  // Check if in wishlist
  const checkRes = await fetch(`/api/v1/wishlist/check/${productId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  const { data: inWishlist } = await checkRes.json();
  
  if (inWishlist) {
    // Remove from wishlist
    await fetch(`/api/v1/wishlist/remove/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    console.log('❤️ → 🤍 Removed from wishlist');
  } else {
    // Add to wishlist
    await fetch('/api/v1/wishlist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ productId })
    });
    console.log('🤍 → ❤️ Added to wishlist');
  }
}
```

### Example: Display Wishlist

```javascript
async function displayWishlist() {
  const response = await fetch('/api/v1/wishlist', {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  
  const { data } = await response.json();
  
  console.log(`You have ${data.totalItems} items in wishlist:`);
  
  data.items.forEach(item => {
    console.log(`- ${item.productName}: $${item.productPrice}`);
    if (!item.available) {
      console.warn('  ⚠️ Out of stock');
    }
  });
}
```

### Example: Heart Icon Component

```jsx
function HeartIcon({ productId }) {
  const [inWishlist, setInWishlist] = useState(false);
  
  useEffect(() => {
    // Check on mount
    fetch(`/api/v1/wishlist/check/${productId}`)
      .then(res => res.json())
      .then(({ data }) => setInWishlist(data));
  }, [productId]);
  
  const handleToggle = async () => {
    if (inWishlist) {
      await fetch(`/api/v1/wishlist/remove/${productId}`, { method: 'DELETE' });
    } else {
      await fetch('/api/v1/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
    }
    setInWishlist(!inWishlist);
  };
  
  return (
    <button onClick={handleToggle}>
      {inWishlist ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## 📊 Database Schema

```sql
CREATE TABLE wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    wishlist_id BIGINT NOT NULL REFERENCES wishlists(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    created_at TIMESTAMP NOT NULL,
    UNIQUE (wishlist_id, product_id)
);
```

---

## 🔄 Wishlist vs Cart

| Feature | Wishlist | Cart |
|---------|----------|------|
| Purpose | Save for later | Purchase now |
| Quantity | No | Yes |
| Stock check | Display only | Validate before checkout |
| Auto-create | Yes | Yes |
| Unique products | Yes | Yes |

---

## 🚀 Common Use Cases

### 1. Product Card Heart Icon

```javascript
// User clicks heart icon
const { data } = await api.post('/wishlist/add', { productId });
console.log(`Total items in wishlist: ${data.totalItems}`);
```

### 2. Wishlist Page

```javascript
// Display all wishlist items
const { data } = await api.get('/wishlist');
data.items.forEach(item => {
  renderProductCard(item);
});
```

### 3. Move to Cart

```javascript
// Add wishlist item to cart, then remove from wishlist
await api.post('/cart/add', { 
  productId: item.productId, 
  quantity: 1 
});
await api.delete(`/wishlist/remove/${item.productId}`);
```

---

## ✅ Best Practices

1. **Check Before Add**: Use `/wishlist/check/{productId}` để avoid duplicate requests
2. **Show Availability**: Display `available` status trên wishlist items
3. **Quick Add to Cart**: Provide "Add to Cart" button trên wishlist items
4. **Loading States**: Show loading khi toggle wishlist
5. **Error Handling**: Handle product not found gracefully
6. **Badge Count**: Display `totalItems` on wishlist icon
7. **Optimistic UI**: Update UI immediately, revert nếu request fails

---

**Happy Wishlisting! ❤️**

