# 🏷️ Categories & Products Pages - D4K E-commerce

## ✅ Status: COMPLETE

Đã tách rõ 2 trang với chức năng khác nhau:
1. **Categories Page** - Danh sách tất cả categories
2. **Products Page** - Danh sách tất cả products với filters nâng cao

---

## 📦 Components Created

### 1. **CategoryCard** (`src/components/categories/CategoryCard.jsx`)
Card component để hiển thị category

**Features:**
- ✅ Category image (grayscale → color hover)
- ✅ Noise overlay texture
- ✅ Product count badge (top-right)
- ✅ Category name + description
- ✅ SHOP NOW CTA
- ✅ Hover: scale + red border
- ✅ Link to `/products?category={id}`

**Props:**
```javascript
{
  category: {
    id: 1,
    name: "T-SHIRTS",
    description: "Cool graphic tees",
    imageUrl: "https://...",
    productCount: 42  // Optional
  }
}
```

**Layout:**
```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │  IMAGE          │ │
│ │  [42 ITEMS]     │ │ (badge)
│ │  + noise        │ │
│ │  + grayscale    │ │
│ └─────────────────┘ │
│ ─────────────────── │
│ T-SHIRTS            │ (bold uppercase)
│ Cool graphic tees   │ (description)
│ SHOP NOW →          │ (CTA)
└─────────────────────┘

Hover: scale 102%, red border
```

**Styling:**
- 2px black border → red hover
- Grayscale 80% → color hover
- Noise overlay (20% opacity)
- Square aspect ratio (1:1)
- Bold display font for name
- Scale 102% + translate arrow on hover

---

### 2. **CategoriesPage** (`src/pages/CategoriesPage.jsx`)
Trang danh sách tất cả categories

**Features:**
- ✅ Fetch all categories (GET /categories)
- ✅ Grid layout 2-4 columns (responsive)
- ✅ Asymmetric layout (some cards 2x size, some 2x height)
- ✅ Loading state (skeleton cards)
- ✅ Error state (try again button)
- ✅ Empty state (no categories)
- ✅ Total count display
- ✅ Breadcrumb navigation

**API Call:**
```javascript
GET /categories

Response: {
  success: true,
  data: [
    { id, name, description, imageUrl, productCount }
  ]
}
```

**Grid Layout:**
```
Desktop (xl: 4 cols):
┌────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │
├────┴────┼────┼────┤
│    5    │ 6  │ 7  │
├────┬────┼────┴────┤
│ 8  │ 9  │   10    │
└────┴────┴─────────┘

Tablet (lg: 3 cols):
┌────┬────┬────┐
│ 1  │ 2  │ 3  │
├────┴────┼────┤
│    4    │ 5  │
└─────────┴────┘

Mobile (sm: 2 cols):
┌────┬────┐
│ 1  │ 2  │
├────┴────┤
│    3    │
└─────────┘
```

**Asymmetric Pattern:**
```javascript
// Every 7th card: 2 columns wide
index % 7 === 0 → col-span-2

// Every 11th card: 2 rows tall
index % 11 === 0 → row-span-2
```

**Page Header:**
```
┌────────────────────────────┐
│ 🔲 CATEGORIES              │
│ EXPLORE ALL PRODUCT        │
│ CATEGORIES                 │
└────────────────────────────┘
```

---

### 3. **ProductsPage** (`src/pages/ProductsPage.jsx`)
Trang danh sách tất cả products với filters nâng cao

**Features:**
- ✅ Fetch all products (GET /products)
- ✅ Filter sidebar (price, size, color, sort)
- ✅ Filter by category (via query param)
- ✅ Pagination (12 items per page)
- ✅ URL query params sync
- ✅ Loading state (skeleton cards)
- ✅ Error state (try again button)
- ✅ Empty state (no products + clear filters)
- ✅ Results summary
- ✅ Breadcrumb navigation

**API Call:**
```javascript
GET /products?page=0&size=12&categoryId=1&minPrice=100000&maxPrice=500000&size=L&color=black&sort=price,asc

Response: {
  success: true,
  data: {
    content: [...products],
    totalPages: 5,
    totalElements: 58,
    page: 0,
    size: 12
  }
}
```

**Filters:**
```javascript
{
  categoryId: string,     // Optional (from query param)
  minPrice: string,       // Min price filter
  maxPrice: string,       // Max price filter
  size: string,           // Size filter (S, M, L, XL, XXL)
  color: string,          // Color filter
  sort: string            // Sort: createdAt,desc | price,asc | price,desc
}
```

**Layout:**
```
┌──────────────────────────────────────┐
│ Breadcrumb: HOME > ALL PRODUCTS      │
├──────────────────────────────────────┤
│ 📦 ALL PRODUCTS                      │
│ 58 PRODUCTS FOUND                    │
├─────────────┬────────────────────────┤
│ FILTERS     │ PRODUCTS GRID          │
│ (Sidebar)   │ ┌────┬────┬────┐       │
│             │ │ 1  │ 2  │ 3  │       │
│ Price       │ ├────┼────┼────┤       │
│ Size        │ │ 4  │ 5  │ 6  │       │
│ Color       │ ├────┼────┼────┤       │
│ Sort        │ │ 7  │ 8  │ 9  │       │
│             │ └────┴────┴────┘       │
│             │ Pagination             │
│             │ Results summary        │
└─────────────┴────────────────────────┘
```

**Grid:** 3 columns (desktop), 2 (tablet), 1 (mobile)

**Query Params Sync:**
```javascript
// URL updates when filters change
/products?category=1&minPrice=100000&maxPrice=500000&size=L&sort=price,asc

// State syncs with URL
const [searchParams, setSearchParams] = useSearchParams();
```

**Empty State:**
```
┌────────────────────────┐
│ 📦 (icon)              │
│ NO PRODUCTS FOUND      │
│ Try adjusting filters  │
│ [CLEAR FILTERS]        │
└────────────────────────┘
```

---

## 🎨 Streetwear Design Elements

### Category Card
```css
Border:    2px black → red hover
Image:     grayscale(80%) → grayscale(0%) hover
           scale(100%) → scale(110%) hover
Overlay:   noise texture (20% opacity)
           dark overlay (0 → 20% hover)
Badge:     black bg → red bg hover
           Positioned top-right
Card:      scale(100%) → scale(102%) hover
Arrow:     translate(0) → translate(4px) hover
```

### Grid Layout
```css
Responsive:
  Mobile: 1-2 columns
  Tablet: 2-3 columns
  Desktop: 3-4 columns

Asymmetric:
  Some cards 2x wide (col-span-2)
  Some cards 2x tall (row-span-2)
  Pattern: every 7th and 11th
```

### Typography
```css
Page Title:  font-display, 4xl-6xl
             UPPERCASE, BOLD, GLITCH effect

Category:    font-display, xl
             UPPERCASE, BOLD

Description: font-medium, sm
             Gray color, 2 lines max

Badge:       font-black, xs
             UPPERCASE, TRACKING-WIDER

CTA:         font-bold, sm
             UPPERCASE, TRACKING-WIDE
```

### Colors
```css
Background:   #FFFFFF (Pure White)
Text:         #000000 (Pure Black)
Accent:       #FF0000 (Pure Red) - hover border, badge
Border:       #000000 2px solid
Overlay:      rgba(0,0,0,0.2) - hover
Noise:        bg-noise 20% opacity
```

---

## 📡 API Integration

### Categories Page

**Fetch Categories:**
```javascript
GET /categories

Response: {
  success: true,
  data: [
    {
      id: 1,
      name: "T-SHIRTS",
      description: "Cool graphic tees and basics",
      imageUrl: "https://example.com/category.jpg",
      productCount: 42,
      parentId: null,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Products Page

**Fetch Products (with filters):**
```javascript
GET /products?page=0&size=12&categoryId=1&minPrice=100000&maxPrice=500000&size=L&color=black&sort=price,asc

Request Params:
{
  page: 0,                    // Page number (0-indexed)
  size: 12,                   // Items per page
  categoryId: 1,              // Optional: filter by category
  minPrice: 100000,           // Optional: min price filter
  maxPrice: 500000,           // Optional: max price filter
  size: "L",                  // Optional: size filter
  color: "black",             // Optional: color filter
  sort: "price,asc"           // Optional: sort (createdAt,desc | price,asc | price,desc)
}

Response: {
  success: true,
  data: {
    content: [...products],   // Array of products
    totalPages: 5,            // Total pages
    totalElements: 58,        // Total products count
    page: 0,                  // Current page
    size: 12,                 // Page size
    first: true,              // Is first page?
    last: false               // Is last page?
  }
}
```

---

## 🎯 Features Checklist

### Categories Page
- [x] Fetch all categories
- [x] Display category cards
- [x] Grid layout (2-4 columns)
- [x] Asymmetric layout pattern
- [x] Category image + noise overlay
- [x] Product count badge
- [x] Category description (2 lines max)
- [x] SHOP NOW CTA
- [x] Hover effects (scale, red border)
- [x] Link to products page with filter
- [x] Loading state (skeleton)
- [x] Error state (try again)
- [x] Empty state (no categories)
- [x] Total count display
- [x] Breadcrumb navigation
- [x] Responsive design

### Products Page
- [x] Fetch all products
- [x] Display product cards
- [x] Filter sidebar (price, size, color, sort)
- [x] Filter by category (query param)
- [x] Grid layout (1-3 columns)
- [x] Pagination (12 items/page)
- [x] URL query params sync
- [x] Clear filters button
- [x] Loading state (skeleton)
- [x] Error state (try again)
- [x] Empty state (no products)
- [x] Results summary
- [x] Page change (scroll to top)
- [x] Breadcrumb navigation
- [x] Responsive design

---

## 🚀 Routes

```javascript
// Categories page - danh sách tất cả categories
/categories

// Products page - danh sách tất cả products (có thể filter)
/products
/products?category=1
/products?minPrice=100000&maxPrice=500000
/products?size=L&color=black
/products?sort=price,asc

// Category page - products theo category (backward compatibility)
/category/:categoryId
```

---

## 📱 Responsive Design

### Categories Page

| Device | Grid | Card Size |
|--------|------|-----------|
| Mobile (< 640px) | 1 col | Full width |
| Small (640-1024px) | 2 cols | Some 2x wide |
| Large (1024-1280px) | 3 cols | Some 2x wide/tall |
| XL (≥ 1280px) | 4 cols | Some 2x wide/tall |

### Products Page

| Device | Sidebar | Grid |
|--------|---------|------|
| Mobile (< 1024px) | Collapsible | 1-2 cols |
| Desktop (≥ 1024px) | Left sidebar | 3 cols |

---

## 💡 Navigation Flow

### User Journey:

**1. From Home Page:**
```
Home → Click "View Categories"
  ↓
Categories Page
  ↓
Click Category Card
  ↓
Products Page (filtered by category)
  ↓
Click Product Card
  ↓
Product Detail Page
```

**2. From Header Menu:**
```
Header → Click "Products"
  ↓
Products Page (all products)
  ↓
Use filters (sidebar)
  ↓
Filtered results
  ↓
Click product
  ↓
Product Detail Page
```

**3. From Category Page (old route):**
```
/category/:id
  ↓
Shows products in that category
(Still works for backward compatibility)
```

---

## 🔧 Implementation Details

### Filter State Management:

```javascript
// ProductsPage
const [filters, setFilters] = useState({
  categoryId: searchParams.get('category') || '',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  size: searchParams.get('size') || '',
  color: searchParams.get('color') || '',
  sort: searchParams.get('sort') || 'createdAt,desc',
});

// Update filters + URL
const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  setCurrentPage(1);
  
  // Sync with URL
  const params = new URLSearchParams();
  Object.entries(newFilters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  setSearchParams(params);
};
```

### Pagination:

```javascript
// State
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const pageSize = 12;

// Page change
const handlePageChange = (page) => {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Results summary
SHOWING {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} OF {totalItems} PRODUCTS
```

### Asymmetric Grid:

```javascript
// Categories grid
{categories.map((category, index) => (
  <div
    key={category.id}
    className={`
      ${index % 7 === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
      ${index % 11 === 0 ? 'lg:row-span-2' : ''}
    `}
  >
    <CategoryCard category={category} />
  </div>
))}
```

---

## 📊 Statistics

```
📦 Components: 3 components
📄 Files: 4 new files
💻 Lines: ~700 lines
🎨 Pages: 2 main pages
📱 Layouts: Responsive grid
🎯 Features: 15+ features per page
⚡ API Calls: 2 endpoints
🎭 Effects: Scale, grayscale, noise, hover
```

---

## 🔗 Related Components

**Reused Components:**
- `Breadcrumb` - Navigation breadcrumbs
- `ProductCard` - Product display (ProductsPage)
- `FilterSidebar` - Filters (ProductsPage)
- `Pagination` - Page navigation (ProductsPage)

**New Components:**
- `CategoryCard` - Category display
- `CategoriesPage` - Categories list
- `ProductsPage` - Products list with filters

**Existing Pages:**
- `CategoryPage` - Products by category (still works)
- `ProductDetailPage` - Product details
- `HomePage` - Home page

---

## ✅ READY TO USE!

**Status**: ✅ **CATEGORIES & PRODUCTS PAGES COMPLETE**  
**Updated**: November 27, 2025

**Access**: 
- Categories: `http://localhost:5173/categories`
- Products: `http://localhost:5173/products`
- Products (filtered): `http://localhost:5173/products?category=1`

---

## 🎉 Summary

Đã tách rõ 2 trang với chức năng riêng biệt:

### **Categories Page** (`/categories`):
- ✅ Danh sách tất cả categories
- ✅ Grid layout 2-4 cột, asymmetric
- ✅ Category card: image + noise + badge + CTA
- ✅ Hover: scale + red border
- ✅ Click → `/products?category={id}`

### **Products Page** (`/products`):
- ✅ Danh sách tất cả products
- ✅ Filter nâng cao: price, size, color, sort
- ✅ Filter by category (query param)
- ✅ Pagination (12 items/page)
- ✅ URL sync
- ✅ Click product → Product Detail

### **Category Page** (`/category/:id`):
- ✅ Giữ nguyên (backward compatibility)
- ✅ Hiển thị products theo category

**STREETWEAR CATEGORIES & PRODUCTS ARE LIVE!** 🏷️📦🔥⚫⚪

