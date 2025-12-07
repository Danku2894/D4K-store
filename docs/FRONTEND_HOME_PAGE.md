# 🎨 Frontend Home Page Implementation - D4K E-commerce

## ✅ Status: COMPLETE

Đã hoàn thành trang chủ (Home Page) với phong cách **Y2K** (Year 2000s) - màu neon, gradient, retro vibes.

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI Library |
| Vite | 5.0.8 | Build Tool |
| TailwindCSS | 3.3.6 | CSS Framework |
| Zustand | 4.4.7 | State Management |
| React Router | 6.20.0 | Navigation |
| Axios | 1.6.2 | HTTP Client |
| Swiper | 11.0.5 | Slider/Carousel |
| React Hot Toast | 2.4.1 | Notifications |
| React Icons | 4.12.0 | Icons |

---

## 🎨 Y2K Design System

### Color Palette
```javascript
y2k: {
  pink: '#FF6FD8',      // Primary neon pink
  purple: '#B76EFD',    // Vibrant purple
  blue: '#6EC3F4',      // Sky blue
  green: '#7FFF00',     // Neon green
  yellow: '#FFE500',    // Electric yellow
  orange: '#FF8C42',    // Sunset orange
}
```

### Typography
- **Display**: Press Start 2P (retro pixel font)
- **Accent**: VT323 (monospace retro)
- **Body**: Inter (modern sans-serif)

### Effects
- ✨ **Neon Glow**: Box shadow với màu neon
- 🌈 **Gradients**: Linear gradients trên backgrounds, text, buttons
- 💫 **Glassmorphism**: Backdrop blur với transparency
- ⚡ **Animations**: Float, glow, glitch, slide-up
- 📐 **Retro Grid**: Grid pattern backgrounds
- 🎯 **Hover Effects**: Scale, shadow, color transitions

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx          ✅ Navigation bar
│   │   │   └── Footer.jsx          ✅ Footer với links
│   │   ├── home/
│   │   │   ├── HeroBanner.jsx      ✅ Slider chính
│   │   │   ├── CategoriesSection.jsx  ✅ Danh mục
│   │   │   ├── FeaturedProducts.jsx   ✅ SP nổi bật
│   │   │   └── NewArrivals.jsx     ✅ SP mới
│   │   └── product/
│   │       └── ProductCard.jsx     ✅ Card sản phẩm
│   ├── pages/
│   │   └── HomePage.jsx            ✅ Trang chủ
│   ├── services/
│   │   ├── api-client.js           ✅ Axios config
│   │   ├── product-service.js      ✅ Product APIs
│   │   ├── category-service.js     ✅ Category APIs
│   │   └── index.js                ✅ Export services
│   ├── store/
│   │   ├── use-cart-store.js       ✅ Cart state
│   │   └── use-wishlist-store.js   ✅ Wishlist state
│   ├── App.jsx                     ✅ Main App
│   ├── main.jsx                    ✅ Entry point
│   └── index.css                   ✅ Global CSS + Y2K theme
├── index.html                      ✅ HTML template
├── vite.config.js                  ✅ Vite config
├── tailwind.config.js              ✅ Tailwind + Y2K colors
├── postcss.config.js               ✅ PostCSS config
├── jsconfig.json                   ✅ Path aliases
├── .eslintrc.cjs                   ✅ ESLint config
├── package.json                    ✅ Dependencies
└── README.md                       ✅ Documentation
```

**Total Files**: 25 files created  
**Lines of Code**: ~2,500 lines

---

## 🎯 Implemented Features

### 1. Layout Components ✅

#### Header
- Logo với Y2K style (glitch effect)
- Navigation menu (Home, Products, Categories, About)
- Search bar với neon border
- Cart icon với badge (số lượng items)
- Wishlist icon với badge
- User profile icon
- Mobile responsive menu
- Sticky header với glassmorphism

#### Footer
- Brand section với social media links
- Quick links
- Customer service links
- Contact information
- Newsletter subscription form
- Copyright & legal links
- Y2K gradient decorative line

### 2. Home Page Sections ✅

#### Hero Banner
- Swiper slider với 3 slides
- Auto-play với fade transition
- Y2K gradient backgrounds
- Retro grid pattern overlay
- Glitch text effect trên title
- CTA buttons với neon hover
- Custom pagination dots
- Decorative floating shapes
- Responsive cho mobile

#### Categories Section
- Grid layout responsive
- Icon cho mỗi category
- Gradient backgrounds (khác nhau mỗi category)
- Glassmorphism cards
- Hover scale & neon shadow
- Slide-up animation
- Link tới products by category
- "View All" button

#### Featured Products
- Grid layout 4 columns (desktop)
- Fetch data từ API: `GET /products?featured=true`
- Product cards với hover effects
- Loading skeleton
- Error handling với retry button
- Empty state
- "View All" button
- Slide-up staggered animation

#### New Arrivals
- Grid layout 4 columns (desktop)
- Fetch data từ API: `GET /products?sort=createdAt,desc`
- Product cards với hover effects
- "Just Dropped" badge
- Different background (dark-900/50)
- Loading skeleton
- Error handling
- "Explore All" button

#### Promo Banner
- Large gradient banner
- Y2K retro grid background
- Floating glow effects
- CTA buttons (Shop Sale, Browse All)
- Responsive layout

#### Newsletter Section
- Glassmorphism card
- Email subscription form
- Y2K gradient button
- Privacy note
- Responsive layout

#### Features Section
- 3 columns grid
- Icons: Free Shipping, Easy Returns, Secure Payment
- Gradient icon backgrounds
- Hover effects

### 3. Product Card Component ✅

**Features:**
- Image với lazy loading
- Loading skeleton animation
- Hover zoom effect
- Stock badge (Hết hàng)
- Sale badge (nếu có sale)
- Category label
- Product name (line-clamp-2)
- Description (line-clamp-2)
- Price (formatted VND)
- Sale price với strikethrough
- Stock warning (< 10 items)
- Hover overlay với actions:
  - Add to Cart button
  - Add to Wishlist button
  - Quick View button
- Decorative bottom line on hover
- Link tới product detail

**Interactions:**
- Add to cart với toast notification
- Toggle wishlist với toast notification
- Wishlist state (filled/unfilled heart)
- Disabled state khi hết hàng
- Smooth transitions & animations

### 4. State Management ✅

#### Cart Store (Zustand + Persist)
- `addToCart(product, quantity)` - Thêm vào giỏ
- `removeFromCart(productId)` - Xóa khỏi giỏ
- `updateQuantity(productId, quantity)` - Cập nhật số lượng
- `clearCart()` - Xóa toàn bộ giỏ
- `getItemQuantity(productId)` - Lấy số lượng của product
- State: `items`, `totalItems`, `totalPrice`
- Persist vào localStorage với key: `d4k-cart-storage`

#### Wishlist Store (Zustand + Persist)
- `addToWishlist(product)` - Thêm vào wishlist
- `removeFromWishlist(productId)` - Xóa khỏi wishlist
- `isInWishlist(productId)` - Check có trong wishlist không
- `toggleWishlist(product)` - Toggle on/off
- `clearWishlist()` - Xóa toàn bộ wishlist
- State: `items`
- Persist vào localStorage với key: `d4k-wishlist-storage`

### 5. API Integration ✅

#### API Client (Axios)
- Base URL: `/api/v1` (proxy qua Vite)
- Timeout: 10 seconds
- Request Interceptor: Auto add JWT token từ localStorage
- Response Interceptor:
  - Return `response.data` directly
  - Handle 401 Unauthorized (auto logout & redirect)
  - Handle network errors
  - Standard error format

#### Product Service
- `getProducts(params)` - Lấy danh sách sản phẩm
- `getFeaturedProducts(page, size)` - Lấy featured products
- `getNewArrivals(page, size)` - Lấy new arrivals (sorted by createdAt desc)
- `getProductById(id)` - Lấy chi tiết sản phẩm
- `searchProducts(keyword, params)` - Tìm kiếm sản phẩm
- `getProductsByCategory(categoryId, params)` - Lọc theo category
- `getRelatedProducts(productId, limit)` - Lấy sản phẩm liên quan

#### Category Service
- `getAllCategories()` - Lấy tất cả categories
- `getCategoryById(id)` - Lấy chi tiết category
- `getParentCategories()` - Lấy parent categories
- `getSubCategories(parentId)` - Lấy sub-categories

### 6. Notifications ✅

**React Hot Toast:**
- Position: bottom-right
- Duration: 3 seconds
- Custom Y2K styling:
  - Background: dark (#1a1a1a)
  - Border: 2px solid neon pink
  - Border radius: 12px
- Success icon: Neon pink
- Error icon: Red
- Custom messages:
  - "Đã thêm {product} vào giỏ hàng!" 🛒
  - "Đã thêm vào wishlist!" ❤️
  - "Đã xóa khỏi wishlist!" 💔
  - API errors

---

## 🎨 Custom CSS Classes

### Utility Classes (in `index.css`)

```css
/* Y2K Gradient Text */
.text-gradient-y2k

/* Y2K Gradient Background */
.bg-gradient-y2k

/* Neon Button */
.btn-neon

/* Product Card Y2K */
.product-card-y2k

/* Container */
.container-y2k

/* Glassmorphism */
.glass-y2k

/* Retro Grid */
.retro-grid

/* Glow Effects */
.glow-pink
.glow-purple
.glow-blue
```

### Animations

```css
/* Float Effect */
@keyframes float

/* Glow Pulse */
@keyframes glow

/* Slide Up */
@keyframes slideUp

/* Shimmer (button hover) */
@keyframes shimmer

/* Glitch Effect */
@keyframes glitch
```

---

## 📱 Responsive Design

### Breakpoints (TailwindCSS)
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: 768px - 1024px
- **Large**: > 1024px

### Responsive Features
- ✅ Mobile-first approach
- ✅ Burger menu cho mobile
- ✅ Search bar responsive
- ✅ Grid layouts responsive:
  - Products: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
  - Categories: 2 cols (mobile) → 3 cols (tablet) → 6 cols (desktop)
- ✅ Hero banner height responsive
- ✅ Typography scales
- ✅ Spacing adjustments
- ✅ Touch-friendly buttons (mobile)

---

## 🚀 Running the Frontend

### Development Mode
```bash
cd frontend
npm install
npm run dev
```
Access: http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

### Requirements
- Backend API running on http://localhost:8080
- Node.js 18+
- npm hoặc yarn

---

## 🔌 API Endpoints Used

| Endpoint | Method | Purpose | Used In |
|----------|--------|---------|---------|
| `/api/v1/products` | GET | Lấy danh sách sản phẩm | FeaturedProducts, NewArrivals |
| `/api/v1/products?featured=true` | GET | Featured products | FeaturedProducts |
| `/api/v1/products?sort=createdAt,desc` | GET | New arrivals | NewArrivals |
| `/api/v1/products/{id}` | GET | Chi tiết sản phẩm | ProductCard (future) |
| `/api/v1/categories` | GET | Danh sách categories | CategoriesSection |

---

## ✨ Key Highlights

### 1. Y2K Aesthetic ⭐⭐⭐⭐⭐
- Authentic Y2K design với neon colors, gradients, retro fonts
- Lấy cảm hứng từ https://www.badhabitsstore.vn/
- Unique hover effects (glow, float, glitch)
- Retro grid backgrounds
- Glassmorphism cards

### 2. Performance ⚡
- Vite build tool (super fast HMR)
- Lazy loading images
- Code splitting (React Router)
- Optimized animations (CSS transforms)
- Persist state vào localStorage (giảm API calls)

### 3. User Experience 🎯
- Smooth transitions & animations
- Loading states với skeleton
- Error handling với retry
- Toast notifications
- Responsive mobile-first
- Touch-friendly interactions
- Persistent cart & wishlist

### 4. Code Quality 💎
- Clean component structure
- Separation of concerns
- Reusable components
- Custom hooks ready
- Service layer pattern
- State management với Zustand
- JSDoc comments
- ESLint configured

### 5. Scalability 📈
- Modular architecture
- Easy to add new pages
- Service-based API calls
- Centralized state management
- Path aliases configured
- Environment variables ready

---

## 🚧 Next Steps

### Immediate (Next Sprint)
- [ ] Products List Page với filters, sorting, pagination
- [ ] Product Detail Page với image gallery, reviews
- [ ] Cart Page với quantity update, coupon apply
- [ ] Wishlist Page với move to cart

### Short-term
- [ ] Checkout Flow (Shipping, Payment, Review)
- [ ] User Authentication (Login, Register)
- [ ] User Profile & Order History
- [ ] Search Results Page

### Medium-term
- [ ] Admin Dashboard
- [ ] Product Reviews & Ratings
- [ ] Payment Gateway Integration
- [ ] Email Notifications

---

## 📊 Statistics

```
📦 Components Created: 10 components
📄 Total Files: 25 files
💻 Lines of Code: ~2,500 lines
🎨 Custom CSS Classes: 15+ classes
🎭 Animations: 5 keyframes
📱 Responsive Breakpoints: 4 breakpoints
🎯 API Endpoints: 5 endpoints integrated
⚡ State Stores: 2 stores (Cart, Wishlist)
```

---

## 🎓 Best Practices Applied

✅ **React Best Practices**
- Functional components with hooks
- Proper useEffect dependencies
- Memoization ready (useMemo, useCallback)
- Error boundaries (future)

✅ **CSS Best Practices**
- Utility-first with TailwindCSS
- No inline styles (except dynamic)
- Consistent spacing scale
- Mobile-first responsive

✅ **Code Organization**
- Feature-based folder structure
- Separation of concerns
- Reusable components
- Service layer for APIs

✅ **Performance**
- Lazy loading
- Image optimization
- Debounced search (future)
- Code splitting

✅ **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Alt text for images

---

## 💡 Tips for Development

### Adding New Components
1. Create component file trong thư mục phù hợp
2. Follow naming: PascalCase cho components
3. Add JSDoc comments
4. Use TailwindCSS classes
5. Apply Y2K color palette
6. Add animations nếu phù hợp

### Styling Guidelines
- Dùng Y2K colors từ `tailwind.config.js`
- Apply gradient cho backgrounds quan trọng
- Add neon glow cho CTAs
- Use glassmorphism cho cards/modals
- Hover effects phải smooth (transition-all duration-300)

### API Integration
- Dùng services từ `src/services/`
- Handle loading state
- Handle error state với retry
- Show toast notifications
- Update global state (Zustand) nếu cần

---

## 🐛 Known Issues / Limitations

1. **Images**: Hiện tại dùng placeholder images. Cần upload real product images.
2. **Banner Images**: Hero banner slides cần real images.
3. **Featured Products API**: Backend cần implement `featured` parameter.
4. **Authentication**: Header profile link chưa có logic check auth.
5. **Search**: Search bar chưa có debounce (sẽ add sau).
6. **Quick View**: Quick view button chưa implement modal.

---

## 📚 References & Inspiration

- **Design Inspiration**: https://www.badhabitsstore.vn/
- **Y2K Aesthetic**: Late 90s / Early 2000s web design
- **Color Palette**: Neon colors, gradients
- **Typography**: Retro pixel fonts, VT323
- **Effects**: Glassmorphism, neon glow, glitch

---

## ✅ Checklist

### Home Page Features
- [x] Hero Banner / Slider
- [x] Categories Navigation
- [x] Featured Products Section
- [x] New Arrivals Section
- [x] Promo Banner
- [x] Newsletter Subscription
- [x] Features Showcase
- [x] Y2K Styling
- [x] Responsive Design
- [x] Loading States
- [x] Error Handling
- [x] Toast Notifications

### Components
- [x] Header with Navigation
- [x] Footer with Links
- [x] ProductCard with Hover Effects
- [x] HeroBanner Slider
- [x] CategoriesSection
- [x] FeaturedProducts
- [x] NewArrivals

### State Management
- [x] Cart Store (Zustand)
- [x] Wishlist Store (Zustand)
- [x] LocalStorage Persistence

### API Integration
- [x] API Client Setup
- [x] Product Service
- [x] Category Service
- [x] Error Handling
- [x] Loading States

---

**Status**: ✅ **HOME PAGE COMPLETE**  
**Next**: 🚀 **Products List & Detail Pages**  
**Updated**: November 27, 2025

