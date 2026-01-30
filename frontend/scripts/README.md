# 🗺️ Sitemap Generator - D4K Store

## Mô tả

Script này tự động generate `sitemap.xml` động từ products và categories trong database thông qua API.

## Cách sử dụng

### 1. Generate Sitemap thủ công

```bash
cd frontend
npm run generate-sitemap
```

### 2. Tự động generate khi build production

Sitemap sẽ tự động được generate trước khi build:

```bash
npm run build
# Script sẽ tự động chạy generate-sitemap trước khi build
```

### 3. Cấu hình

Chỉnh sửa các constants trong `scripts/generate-sitemap.js`:

```javascript
const BASE_URL = 'https://www.web-apps.live';
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## Yêu cầu

- Backend API phải đang chạy
- Endpoints cần có:
  - `GET /api/categories` - Lấy danh sách categories
  - `GET /api/products?size=1000&page=0` - Lấy tất cả products

## Output

File `public/sitemap.xml` sẽ được tạo với cấu trúc:

- Static pages (/, /products, /categories, /about)
- Dynamic category pages (/category/:id)
- Dynamic product pages (/product/:id)
- Product images (image sitemap)

## Lưu ý

- Nếu backend chưa chạy, script sẽ chỉ tạo sitemap với static pages
- Sitemap nên được regenerate mỗi khi có products/categories mới
- Có thể setup cron job trên server để tự động regenerate hàng ngày

## Troubleshooting

### Lỗi "Cannot connect to API"
- Kiểm tra backend có đang chạy không
- Kiểm tra `API_BASE_URL` có đúng không

### Sitemap không có products
- Kiểm tra API endpoint `/api/products` có trả về data không
- Kiểm tra response format có đúng không

### Permission denied khi write file
- Kiểm tra quyền write vào folder `public/`
