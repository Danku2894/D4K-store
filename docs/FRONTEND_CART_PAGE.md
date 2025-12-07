# 🛒 Cart Page Implementation - D4K E-commerce

## ✅ Status: COMPLETE

Đã hoàn thành Cart Page với phong cách **Streetwear/Bad Habits** - bold typography, black/white/red colors, modular layout.

---

## 📦 Components Created

### 1. **CartService** (`src/services/cart-service.js`)
**API Methods:**
```javascript
getCart()                          // GET /cart
addToCart(data)                    // POST /cart/add
updateCartItem(itemId, data)       // PUT /cart/update/{itemId}
removeCartItem(itemId)             // DELETE /cart/remove/{itemId}
clearCart()                        // DELETE /cart/clear
```

### 2. **CouponService** (`src/services/coupon-service.js`)
**API Methods:**
```javascript
applyCoupon(data)                  // POST /coupons/apply
getAvailableCoupons()              // GET /coupons
validateCoupon(code)               // GET /coupons/validate/{code}
```

---

### 3. **CartItem** (`src/components/cart/CartItem.jsx`)
**Features:**
- ✅ Product image (grayscale filter + hover color)
- ✅ Product info (name, category, price)
- ✅ Quantity selector (+/- buttons + input)
- ✅ Subtotal display
- ✅ Remove button
- ✅ Stock validation
- ✅ Stock warning (< 5 items)
- ✅ Loading/updating states

**Props:**
```javascript
{
  item: {
    id: 1,
    product: { id, name, price, stock, imageUrl, categoryName },
    quantity: 2
  },
  onUpdateQuantity: (itemId, newQuantity) => {},
  onRemove: (itemId) => {},
  updating: false
}
```

**Layout (Grid 12 columns):**
```
┌─────────────────────────────────────────────┐
│ Image │ Product Info │ Quantity │ Total │ × │
│  (2)  │     (5)      │   (2)    │  (2)  │(1)│
└─────────────────────────────────────────────┘
```

**Styling:**
- 2px black border
- White background
- Hover shadow effect
- Grayscale image → color on hover
- Square quantity buttons
- Bold typography

---

### 4. **CouponInput** (`src/components/cart/CouponInput.jsx`)
**Features:**
- ✅ Input field (UPPERCASE)
- ✅ Apply button
- ✅ Applied coupon display
- ✅ Remove coupon button
- ✅ Discount display (percentage or fixed)
- ✅ Validation
- ✅ Toast notifications
- ✅ Loading state

**Props:**
```javascript
{
  orderAmount: 1000000,              // Subtotal
  onApplyCoupon: (couponData) => {},
  appliedCoupon: null,               // Current coupon
  onRemoveCoupon: () => {}
}
```

**States:**
```javascript
// No coupon
┌─────────────────────────────┐
│ COUPON CODE                 │
│ [ENTER CODE] [APPLY]        │
└─────────────────────────────┘

// Applied coupon
┌─────────────────────────────┐
│ ✓ SUMMER2024  [×]           │
│ DISCOUNT: -20%              │
└─────────────────────────────┘
```

**Styling:**
- Tag icon
- Green border (applied)
- Bold uppercase
- Neon green for success

---

### 5. **CartSummary** (`src/components/cart/CartSummary.jsx`)
**Features:**
- ✅ Subtotal display
- ✅ Discount display (if coupon applied)
- ✅ Shipping display (FREE)
- ✅ Total calculation
- ✅ Coupon input integration
- ✅ Checkout button
- ✅ Continue shopping link
- ✅ Additional info (security, shipping, return)
- ✅ Payment methods icons
- ✅ Sticky positioning (desktop)

**Props:**
```javascript
{
  subtotal: 1000000,
  totalItems: 3,
  appliedCoupon: null,
  onApplyCoupon: (couponData) => {},
  onRemoveCoupon: () => {}
}
```

**Layout:**
```
┌─────────────────────────────┐
│ ORDER SUMMARY               │
├─────────────────────────────┤
│ SUBTOTAL (3 ITEMS)   1.000k │
│ DISCOUNT            -200k   │
│ SHIPPING              FREE  │
│ ─────────────────────────   │
│ TOTAL               800k    │
├─────────────────────────────┤
│ COUPON CODE                 │
│ [Input + Apply Button]      │
├─────────────────────────────┤
│ [PROCEED TO CHECKOUT] →     │
│ [CONTINUE SHOPPING]         │
├─────────────────────────────┤
│ ✓ SECURE CHECKOUT          │
│ ✓ FREE SHIPPING            │
│ ✓ 30-DAY RETURN            │
└─────────────────────────────┘
```

**Styling:**
- 4px black border
- Large total price (3xl font)
- Bold buttons
- Red checkout button (hover)
- Sticky on desktop

---

### 6. **CartPage** (`src/pages/CartPage.jsx`)
**Main Page Layout:**

```
┌─────────────────────────────────────────┐
│ Breadcrumb                              │
├─────────────────────────────────────────┤
│ SHOPPING CART             [CLEAR CART]  │
│ 3 ITEMS IN YOUR CART                    │
├───────────────────────┬─────────────────┤
│ Cart Items            │ Cart Summary    │
│ (Left - 2 cols)       │ (Right - 1 col) │
│                       │ - Subtotal      │
│ ┌─────────────────┐   │ - Discount      │
│ │ Product 1       │   │ - Shipping      │
│ └─────────────────┘   │ - Total         │
│                       │ - Coupon        │
│ ┌─────────────────┐   │ - Checkout BTN  │
│ │ Product 2       │   │                 │
│ └─────────────────┘   │ (Sticky)        │
│                       │                 │
│ ┌─────────────────┐   │                 │
│ │ Product 3       │   │                 │
│ └─────────────────┘   │                 │
├───────────────────────┴─────────────────┤
│ Additional Info (3 columns)             │
│ Free Shipping | Easy Returns | Secure   │
└─────────────────────────────────────────┘
```

**Features:**

#### **State Management:**
Uses Zustand store (`use-cart-store.js`):
```javascript
{
  items: [...],           // Cart items
  totalItems: 3,          // Total item count
  totalPrice: 1000000,    // Total price
  updateQuantity(),       // Update item quantity
  removeFromCart(),       // Remove item
  clearCart()            // Clear all items
}
```

#### **API Integration (Ready):**
- ✅ GET /cart - Fetch cart from server
- ✅ PUT /cart/update/{itemId} - Update quantity
- ✅ DELETE /cart/remove/{itemId} - Remove item
- ✅ DELETE /cart/clear - Clear cart
- ✅ POST /coupons/apply - Apply coupon

*Currently using Zustand store only. API calls commented out and ready to activate.*

#### **Empty State:**
```
┌─────────────────────────────┐
│       🛒 (icon)             │
│  YOUR CART IS EMPTY         │
│  Start shopping now!        │
│  [START SHOPPING]           │
└─────────────────────────────┘
```

#### **Interactions:**
1. **Update Quantity**: +/- buttons or type → update store → toast
2. **Remove Item**: Click trash icon → confirm → remove → toast
3. **Clear Cart**: Click button → confirm → clear all → toast
4. **Apply Coupon**: Enter code → apply → show discount → toast
5. **Checkout**: Click button → navigate to /checkout

---

## 🎨 Streetwear Design Elements

### Typography
```css
Title:    font-display (Bebas Neue), 4xl-6xl
          UPPERCASE, BOLD, GLITCH effect

Labels:   UPPERCASE, BOLD, TRACKING-WIDER
          text-xs to text-sm

Numbers:  font-black, 2xl-3xl
          Bold prices
```

### Colors
```css
Background:   #FFFFFF (Pure White)
Text:         #000000 (Pure Black)
Accent:       #FF0000 (Pure Red)
Success:      #00FF00 (Neon Green) - for free shipping, discount
Border:       #000000 2-4px solid
```

### Components
```css
Cards:      White bg, 2px black border
            Hover shadow effect

Buttons:    Black → Red hover
            Square (no rounded)
            Bold uppercase

Inputs:     2px black border
            Red focus border
            Uppercase text

Images:     Grayscale 80% → color hover
```

### Effects
```css
- Hover shadow (cards)
- Scale effect (buttons)
- Glitch text (title)
- Grayscale to color (images)
- Fade out (remove animation)
```

---

## 📡 API Integration

### Current Implementation:
**Zustand Store** (Client-side):
- ✅ Items stored in localStorage
- ✅ Auto-calculate totals
- ✅ Instant updates (no API delay)
- ✅ Persist across sessions

### Ready for Backend:
**API Calls** (Commented out):
```javascript
// In handleUpdateQuantity()
await cartService.updateCartItem(itemId, { quantity });

// In handleRemoveItem()
await cartService.removeCartItem(itemId);

// In handleClearCart()
await cartService.clearCart();

// In handleApplyCoupon()
await couponService.applyCoupon({ code, orderAmount });
```

### Coupon API:
```javascript
// Apply coupon
POST /coupons/apply
Body: {
  code: "SUMMER2024",
  orderAmount: 1000000
}

Response: {
  success: true,
  data: {
    code: "SUMMER2024",
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscount: 500000,
    finalDiscount: 200000
  }
}
```

---

## 🎯 Features Checklist

### Cart Items
- [x] Display product image (grayscale filter)
- [x] Product name & category
- [x] Price per item
- [x] Quantity selector (+/-)
- [x] Quantity input (type directly)
- [x] Subtotal calculation
- [x] Remove button
- [x] Stock validation
- [x] Stock warning (< 5 items)
- [x] Link to product detail

### Cart Summary
- [x] Subtotal display
- [x] Item count
- [x] Discount display (if coupon)
- [x] Shipping (FREE)
- [x] Total calculation
- [x] Coupon input
- [x] Applied coupon display
- [x] Remove coupon
- [x] Checkout button
- [x] Continue shopping link
- [x] Additional info
- [x] Payment methods
- [x] Sticky positioning

### Coupon
- [x] Input field (uppercase)
- [x] Apply button
- [x] Validation
- [x] Success state
- [x] Remove coupon
- [x] Discount calculation (percentage/fixed)
- [x] Max discount limit
- [x] Toast notifications

### UX
- [x] Empty cart state
- [x] Clear cart button
- [x] Breadcrumb navigation
- [x] Loading states
- [x] Toast notifications
- [x] Confirmation dialogs
- [x] Responsive layout
- [x] Smooth animations

---

## 🚀 Routes Added

```javascript
// Cart page
/cart

// Checkout (placeholder)
/checkout
```

---

## 📱 Responsive Design

### Layout Breakpoints:

| Device | Layout | Summary |
|--------|--------|---------|
| Mobile (< 1024px) | Stacked | Below items |
| Desktop (≥ 1024px) | 2-column | Right side sticky |

### Mobile Features:
- ✅ Full-width cart items
- ✅ Vertical stacking
- ✅ Touch-friendly buttons
- ✅ Summary below items
- ✅ Hidden table headers

### Desktop Features:
- ✅ Table layout (grid 12 cols)
- ✅ Table headers visible
- ✅ Sticky cart summary
- ✅ Side-by-side layout
- ✅ Larger buttons

---

## 🎨 Key Design Features

### 1. **Grayscale Images**
```css
.filter-grayscale-80 {
  filter: grayscale(80%);
}

.filter-grayscale-80:hover {
  filter: grayscale(0%);
}
```

### 2. **Bold Typography**
```css
/* All labels */
text-xs font-black uppercase tracking-wider

/* Prices */
text-2xl to text-3xl font-black

/* Buttons */
font-black uppercase tracking-wider
```

### 3. **Square Design**
```css
/* All elements */
border-radius: 0;  /* No rounded corners */
```

### 4. **Black Borders**
```css
/* Cards */
border: 2px solid #000000;

/* Summary box */
border: 4px solid #000000;
```

---

## 💡 Calculations

### Subtotal:
```javascript
const subtotal = cartItems.reduce((sum, item) => 
  sum + (item.product.price * item.quantity), 0
);
```

### Discount:
```javascript
// Percentage
const discount = (subtotal * coupon.discountValue) / 100;
const finalDiscount = Math.min(discount, coupon.maxDiscount);

// Fixed amount
const finalDiscount = Math.min(coupon.discountValue, subtotal);
```

### Total:
```javascript
const shipping = 0; // Free
const total = subtotal - discount + shipping;
```

---

## 📊 Statistics

```
📦 Components: 4 components
📄 Files: 7 new files
💻 Lines: ~1000 lines
🎨 Sections: 3 main sections
📱 Layouts: Mobile + Desktop
🎯 Features: 25+ features
⚡ Services: 2 API services
🎭 Effects: Grayscale, scale, shadow
```

---

## 🔧 Usage Example

### Navigate to Cart:
```jsx
<Link to="/cart">
  View Cart
</Link>
```

### Add to Cart (from Product Page):
```javascript
import useCartStore from '@store/use-cart-store';

const addToCart = useCartStore((state) => state.addToCart);

addToCart(product, quantity);
```

### Cart Icon with Badge:
```jsx
import useCartStore from '@store/use-cart-store';

const totalItems = useCartStore((state) => state.totalItems);

<Link to="/cart">
  🛒 {totalItems > 0 && <span>{totalItems}</span>}
</Link>
```

---

## 🚧 Future Enhancements

### Phase 1 (Optional):
- [ ] Save for later feature
- [ ] Product recommendations in cart
- [ ] Quantity limits per product
- [ ] Estimated delivery date
- [ ] Gift wrapping option

### Phase 2 (Advanced):
- [ ] Multiple coupons
- [ ] Loyalty points
- [ ] Bulk discount rules
- [ ] Suggested add-ons
- [ ] Cart expiration timer

---

## 🐛 Known Limitations

1. **API Integration**:
   - Currently using Zustand only (client-side)
   - Backend API calls commented out
   - Need to activate when backend ready

2. **Coupon**:
   - Single coupon only
   - No stacking
   - Min order validation client-side only

3. **Stock**:
   - Stock check is optimistic
   - Backend should validate on checkout

4. **Persistence**:
   - Cart in localStorage (client-side)
   - Should sync with backend for logged-in users

---

## 📝 Testing Checklist

### Functional Testing:
- [ ] Add items to cart
- [ ] Update quantity (+/-)
- [ ] Remove single item
- [ ] Clear entire cart
- [ ] Apply valid coupon
- [ ] Apply invalid coupon
- [ ] Remove coupon
- [ ] Calculate totals correctly
- [ ] Navigate to checkout
- [ ] Continue shopping link
- [ ] Empty cart state
- [ ] Stock validation

### Responsive Testing:
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768-1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Summary sticky on desktop
- [ ] Cart items responsive
- [ ] Buttons touch-friendly

### Edge Cases:
- [ ] Empty cart
- [ ] Single item
- [ ] Many items (10+)
- [ ] Out of stock item
- [ ] Max quantity (99+)
- [ ] Long product name
- [ ] Large numbers
- [ ] Coupon min order not met
- [ ] Multiple coupon attempts

---

## ✅ READY TO USE!

**Status**: ✅ **CART PAGE COMPLETE**  
**Next**: 💳 **Checkout Page**  
**Updated**: November 27, 2025

**Access**: 
- Direct: `http://localhost:5173/cart`
- From header: Click cart icon
- From any "Add to Cart" button

---

## 🎉 Summary

Cart Page với đầy đủ tính năng:
- ✅ View cart items (table/grid layout)
- ✅ Update quantities (+/- or type)
- ✅ Remove items (single or clear all)
- ✅ Apply coupon codes
- ✅ Calculate totals (subtotal, discount, shipping, total)
- ✅ Checkout button
- ✅ Empty cart state
- ✅ Streetwear design (bold, square, black/white/red)
- ✅ Responsive layout
- ✅ Toast notifications
- ✅ Zustand state management
- ✅ API integration ready

**STREETWEAR CART PAGE IS LIVE!** 🛒🔥⚫⚪

