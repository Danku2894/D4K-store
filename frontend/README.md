# 🎨 D4K E-commerce Frontend - Y2K Style

Modern React frontend với phong cách **Y2K** (năm 2000s) - màu neon, gradient, retro vibes.

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool (siêu nhanh)
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - State management (đơn giản hơn Redux)
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Swiper** - Slider/Carousel
- **React Hot Toast** - Notifications

## 🎨 Design Features

### Y2K Style Elements:
- ✨ Neon colors (pink, purple, blue)
- 🌈 Gradient backgrounds
- 🎮 Retro fonts (Press Start 2P, VT323)
- ⚡ Hover animations (glow, float, glitch effects)
- 💫 Glassmorphism cards
- 🔆 Shadow neon effects
- 📐 Retro grid backgrounds

### Components:
- **Header** - Navigation với search, cart, wishlist
- **Footer** - Links, social media, newsletter
- **HeroBanner** - Slider với Y2K style
- **ProductCard** - Card sản phẩm với hover effects
- **FeaturedProducts** - Sản phẩm nổi bật
- **NewArrivals** - Sản phẩm mới
- **CategoriesSection** - Danh mục sản phẩm

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js 18+ 
- npm hoặc yarn
- Backend API running on http://localhost:8080

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### 4. Build for Production

```bash
npm run build
```

Build output sẽ ở folder `dist/`

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── layout/      # Header, Footer
│   │   ├── home/        # Home page components
│   │   └── product/     # Product components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── hooks/           # Custom hooks (coming soon)
│   ├── utils/           # Utility functions (coming soon)
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global CSS (Y2K theme)
├── index.html
├── vite.config.js
├── tailwind.config.js   # Y2K color palette
├── postcss.config.js
└── package.json
```

## 🎯 Key Features

### Home Page ✅
- Hero banner/slider với Y2K style
- Categories navigation
- Featured Products section
- New Arrivals section
- Promo banners
- Newsletter subscription
- Features showcase

### State Management
- **Cart Store** - Quản lý giỏ hàng (persist localStorage)
- **Wishlist Store** - Quản lý danh sách yêu thích (persist localStorage)

### API Integration
- **Product Service** - Lấy danh sách, chi tiết sản phẩm
- **Category Service** - Lấy danh mục sản phẩm
- API client với axios interceptors (auto JWT token)

## 🎨 Y2K Color Palette

```js
colors: {
  y2k: {
    pink: '#FF6FD8',
    purple: '#B76EFD',
    blue: '#6EC3F4',
    green: '#7FFF00',
    yellow: '#FFE500',
    orange: '#FF8C42',
  }
}
```

## 📦 Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔌 API Configuration

API base URL được config trong `vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

Hoặc có thể config trong `src/services/api-client.js` cho production.

## 🎭 Custom Components

### ProductCard
Card hiển thị sản phẩm với:
- Image hover zoom
- Add to cart button
- Wishlist toggle
- Quick view
- Stock badge
- Sale badge

### HeroBanner
Slider với:
- Auto-play
- Fade transition
- Custom pagination
- Y2K gradient overlays
- Glitch text effects

## 🚧 Coming Soon

- [ ] Products List Page
- [ ] Product Detail Page
- [ ] Cart Page
- [ ] Wishlist Page
- [ ] Checkout Flow
- [ ] User Authentication Pages
- [ ] User Profile Page
- [ ] Order History
- [ ] Search & Filter
- [ ] Admin Dashboard

## 🎨 Customization

### Thay đổi màu sắc Y2K:
Edit `tailwind.config.js` → `colors.y2k`

### Thay đổi fonts:
Edit `tailwind.config.js` → `fontFamily`
Update Google Fonts trong `index.html`

### Thay đổi animations:
Edit `src/index.css` → `@keyframes`

## 📱 Responsive Design

- **Mobile First** approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile menu toggle
- Responsive grid layouts

## 🐛 Troubleshooting

### Vite proxy không hoạt động:
- Kiểm tra backend có chạy ở port 8080 không
- Restart dev server sau khi thay đổi vite.config.js

### CSS không load:
- Kiểm tra import './index.css' trong main.jsx
- Kiểm tra TailwindCSS config

### API calls failed:
- Kiểm tra backend đang chạy
- Kiểm tra CORS config trong backend
- Check console để xem error details

## 📚 Documentation

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Router Docs](https://reactrouter.com)

## 👨‍💻 Development

### Add new component:
1. Create component file trong `src/components/`
2. Follow naming convention: PascalCase
3. Add JSDoc comments
4. Use TailwindCSS cho styling
5. Use Y2K color palette

### Add new page:
1. Create page file trong `src/pages/`
2. Add route trong `src/App.jsx`
3. Update navigation links

## 📝 Notes

- **Y2K Style**: Lấy cảm hứng từ https://www.badhabitsstore.vn/
- **Performance**: Lazy load images, code splitting
- **SEO**: React Helmet sẽ được thêm sau
- **Analytics**: Google Analytics sẽ được integrate sau

---

**Status**: Home Page Complete ✅  
**Next**: Products List & Detail Pages 🚀

