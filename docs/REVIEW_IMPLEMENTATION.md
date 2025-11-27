# Review Management Implementation

**Module**: Review Management  
**Status**: ✅ Completed  
**Date**: November 27, 2025  
**Version**: 1.0

---

## 📋 Overview

Review Management module cho phép khách hàng đánh giá và review sản phẩm sau khi mua. Module này bao gồm:

- Tạo review cho sản phẩm (với rating 1-5 sao)
- Xem reviews của sản phẩm (public)
- Xem reviews của user
- Xóa review (user hoặc admin)
- Tính toán average rating và review count

---

## 🏗️ Architecture

### Entity Layer

**Review Entity** (`com.d4k.ecommerce.modules.review.entity.Review`)

```java
@Entity
@Table(name = "reviews")
public class Review {
    private Long id;
    private User user;              // ManyToOne
    private Product product;        // ManyToOne
    private Integer rating;         // 1-5
    private String comment;         // TEXT
    private LocalDateTime createdAt;
}
```

**Key Features:**
- Unique constraint: (user_id, product_id) - 1 user chỉ review 1 product 1 lần
- Indexes: product_id, user_id, rating, created_at
- Check constraint: rating BETWEEN 1 AND 5

---

## 🔌 API Endpoints

### 1. Create Review
```
POST /api/v1/reviews
Authorization: Bearer <JWT_TOKEN>
Role: USER
```

**Request Body:**
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Sản phẩm rất tốt!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "userName": "Nguyễn Văn A",
    "productId": 1,
    "productName": "Áo Thun Nam Basic",
    "rating": 5,
    "comment": "Sản phẩm rất tốt!",
    "createdAt": "2025-11-27T10:30:00"
  }
}
```

---

### 2. Get Product Reviews
```
GET /api/v1/reviews/product/{productId}?page=0&size=10&sortBy=createdAt&sortDir=DESC
Authorization: Not Required (Public)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product reviews fetched successfully",
  "data": {
    "content": [...],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 25,
    "totalPages": 3,
    "last": false
  },
  "metadata": {
    "averageRating": 4.5,
    "totalReviews": 25
  }
}
```

---

### 3. Get My Reviews
```
GET /api/v1/reviews/my-reviews?page=0&size=10
Authorization: Bearer <JWT_TOKEN>
Role: USER
```

---

### 4. Delete Review
```
DELETE /api/v1/reviews/{id}
Authorization: Bearer <JWT_TOKEN>
Role: USER or ADMIN
```

**Rules:**
- USER: Chỉ xóa được review của mình
- ADMIN: Xóa được mọi review

---

## 🔐 Business Logic

### ReviewService Implementation

**Key Methods:**

1. **createReview()**
   - Validate user tồn tại
   - Validate product tồn tại
   - Check duplicate review
   - **TODO:** Validate user đã mua sản phẩm (sau khi có Order module)
   - Validate rating (1-5)
   - Create và save review

2. **getProductReviews()**
   - Validate product tồn tại
   - Get paginated reviews
   - Return with metadata (avgRating, totalReviews)

3. **deleteReview()**
   - USER: Check ownership
   - ADMIN: Direct delete
   - Delete review

4. **getAverageRating()**
   - Calculate average rating using SQL query
   - Return 0.0 nếu không có reviews

5. **getReviewCount()**
   - Count total reviews cho product

---

## 🗄️ Database Schema

```sql
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_review_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    CONSTRAINT fk_review_product 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    CONSTRAINT uk_user_product_review 
        UNIQUE (user_id, product_id)
);

CREATE INDEX idx_review_product ON reviews(product_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_review_rating ON reviews(rating);
CREATE INDEX idx_review_created_at ON reviews(created_at DESC);
```

**Migrations:**
- `V9__create_reviews_table.sql` - Tạo table và indexes
- `V10__seed_reviews.sql` - Seed sample data

---

## ✅ Validations

### Input Validation (DTO Level)
```java
@NotNull(message = "Product ID is required")
private Long productId;

@NotNull(message = "Rating is required")
@Min(value = 1, message = "Rating must be at least 1")
@Max(value = 5, message = "Rating must not exceed 5")
private Integer rating;

@Size(max = 1000, message = "Comment must not exceed 1000 characters")
private String comment;
```

### Business Validation (Service Level)
- User phải tồn tại
- Product phải tồn tại
- Rating phải từ 1-5
- User chưa review product này
- **TODO:** User đã mua product (có Order với status DELIVERED)

### Security Validation
- Only authenticated users can create reviews
- Users can only delete their own reviews
- Admins can delete any review

---

## 📊 Key Features

### 1. Rating System
- 1-5 stars rating
- Average rating calculation
- Review count tracking
- Real-time metadata in response

### 2. Duplicate Prevention
- Database unique constraint
- Service layer validation
- Meaningful error messages

### 3. Access Control
- Public: View reviews
- USER: Create và delete own reviews
- ADMIN: Delete any review

### 4. Pagination & Sorting
- Paginated response
- Sort by createdAt hoặc rating
- Ascending/Descending order

---

## 🔄 Integration Points

### Current Integrations
- ✅ **User Module**: Foreign key to users table
- ✅ **Product Module**: Foreign key to products table
- ✅ **Security**: JWT authentication
- ✅ **Validation**: Spring Validation

### Future Integrations (TODO)
- ⏳ **Order Module**: Validate purchase before review
- ⏳ **Notification**: Notify product owner on new review
- ⏳ **Email**: Send email on review creation
- ⏳ **Analytics**: Track review trends

---

## 📁 File Structure

```
backend/src/main/java/com/d4k/ecommerce/modules/review/
├── entity/
│   └── Review.java
├── repository/
│   └── ReviewRepository.java
├── dto/
│   ├── request/
│   │   └── ReviewRequest.java
│   └── response/
│       └── ReviewResponse.java
├── mapper/
│   └── ReviewMapper.java
├── service/
│   ├── ReviewService.java
│   └── impl/
│       └── ReviewServiceImpl.java
└── controller/
    └── ReviewController.java

backend/src/main/resources/db/migration/
├── V9__create_reviews_table.sql
└── V10__seed_reviews.sql

docs/api/
└── review-management.md
```

---

## 🧪 Testing

### Manual Testing với cURL

**1. Create Review**
```bash
curl -X POST http://localhost:8080/api/v1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "rating": 5,
    "comment": "Sản phẩm tuyệt vời!"
  }'
```

**2. Get Product Reviews**
```bash
curl -X GET "http://localhost:8080/api/v1/reviews/product/1?page=0&size=10"
```

**3. Get My Reviews**
```bash
curl -X GET "http://localhost:8080/api/v1/reviews/my-reviews" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**4. Delete Review**
```bash
curl -X DELETE http://localhost:8080/api/v1/reviews/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🚀 Future Enhancements

### Phase 2 (Short-term)
- [ ] Purchase validation integration với Order module
- [ ] Review images upload
- [ ] Helpful/Not Helpful votes
- [ ] Report inappropriate reviews
- [ ] Admin approve/reject reviews

### Phase 3 (Long-term)
- [ ] Review replies (Seller response)
- [ ] Review filtering (by rating, verified purchase)
- [ ] Review analytics dashboard
- [ ] AI-powered review sentiment analysis
- [ ] Review recommendations

---

## 🐛 Known Issues & Limitations

1. **Purchase Validation**: Chưa validate user đã mua sản phẩm. Will implement sau khi có Order module.

2. **Image Upload**: Chưa support upload ảnh trong review.

3. **Soft Delete**: Đang dùng hard delete, có thể implement soft delete sau.

4. **Review Update**: Chưa có API để update review, chỉ có delete và create mới.

---

## 📚 References

- **API Documentation**: `docs/api/review-management.md`
- **Entity Documentation**: JavaDoc trong source code
- **Database Schema**: `V9__create_reviews_table.sql`
- **Implementation Status**: `docs/IMPLEMENTATION_STATUS.md`

---

## ✅ Completion Checklist

- [x] Review entity với proper relationships
- [x] ReviewRepository với custom queries
- [x] DTOs (Request & Response)
- [x] ReviewMapper
- [x] ReviewService interface & implementation
- [x] ReviewController với 4 endpoints
- [x] Input validation
- [x] Business logic validation
- [x] Security (JWT + Role-based)
- [x] Database migrations
- [x] Seed data
- [x] API documentation
- [x] Error codes
- [x] Logging
- [x] Exception handling

---

## 🎯 Summary

Review Management module đã được implement đầy đủ với các tính năng cơ bản:

✅ **Create Review**: User có thể đánh giá sản phẩm với rating 1-5 và comment  
✅ **View Reviews**: Public có thể xem reviews của sản phẩm với pagination  
✅ **My Reviews**: User xem danh sách reviews của mình  
✅ **Delete Review**: User xóa review của mình, Admin xóa bất kỳ review nào  
✅ **Rating Stats**: Tự động tính average rating và review count  
✅ **Validation**: Đầy đủ validation ở tất cả các layer  
✅ **Security**: JWT authentication và role-based access control  
✅ **Database**: Migration scripts và seed data  
✅ **Documentation**: API docs và implementation guide  

**Next Step**: Tiếp tục implement **Order Management** module để có thể integrate purchase validation cho reviews.

---

**Implemented by**: D4K Development Team  
**Date**: November 27, 2025  
**Status**: ✅ Production Ready (except purchase validation)

