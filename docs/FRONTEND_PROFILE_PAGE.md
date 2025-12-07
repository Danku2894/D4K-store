# 👤 User Profile Page & Dropdown Menu - D4K E-commerce

## ✅ Status: COMPLETE

Đã hoàn thành User Dropdown Menu trong Header và Profile Page với phong cách **Streetwear/Bad Habits** - two-column layout, bold typography, grunge borders.

---

## 📦 Components Created

### 1. **UserService** (`src/services/user-service.js`)
**API Methods:**
```javascript
getMyProfile()                     // GET /users/me
updateMyProfile(data)              // PUT /users/me
changePassword(data)               // PUT /users/me/password
uploadAvatar(file)                 // POST /users/me/avatar
```

---

### 2. **User Dropdown Menu** (Header.jsx - Updated)

**Dropdown khi hover vào User Icon:**

```
┌──────────────────────────┐
│ 👤 NGUYEN VAN A          │
│ user@example.com         │
├──────────────────────────┤
│ ⚙️  MY PROFILE            │
│ 🛒 MY ORDERS              │
├──────────────────────────┤
│ 🚪 LOGOUT                 │
└──────────────────────────┘
```

**Features:**
- ✅ Hover trigger (onMouseEnter/onMouseLeave)
- ✅ Show user name (first name only) next to icon
- ✅ Conditional rendering (logged in vs not logged in)
- ✅ **Logged In Menu**:
  - User info (name + email)
  - MY PROFILE link
  - MY ORDERS link
  - Divider
  - LOGOUT button (red hover)
- ✅ **Not Logged In Menu**:
  - LOGIN link
  - REGISTER link
- ✅ Auto-update on login/logout
- ✅ Dropdown positioning (right-aligned)
- ✅ Black borders, white background
- ✅ Hover: black background, white text
- ✅ Logout button: red hover

**Styling:**
```css
Dropdown:  2px border, shadow-street
           Width: 14rem (224px)
           Right-aligned
           z-50

Items:     Hover: black bg, white text
           Bold uppercase
           Icon + label

Logout:    Hover: red bg, white text
```

---

### 3. **AccountNav** (`src/components/profile/AccountNav.jsx`)
**Left sidebar navigation cho account pages**

```
┌──────────────────────────┐
│ 👤 MY PROFILE            │
│ Personal info & settings │ (active: red border)
├──────────────────────────┤
│ 📍 ADDRESSES              │
│ Manage delivery addresses│
├──────────────────────────┤
│ 🛒 MY ORDERS              │
│ Track & manage orders    │
├──────────────────────────┤
│ ❤️  WISHLIST              │
│ Saved favorite items     │
├──────────────────────────┤
│ 🔒 CHANGE PASSWORD        │
│ Update your password     │
├──────────────────────────┤
│ 🚪 LOGOUT                 │
│ Sign out of your account │
└──────────────────────────┘
```

**Navigation Items:**
```javascript
[
  { path: '/profile', icon: FiUser, label: 'MY PROFILE' },
  { path: '/profile/addresses', icon: FiMapPin, label: 'ADDRESSES' },
  { path: '/orders', icon: FiShoppingBag, label: 'MY ORDERS' },
  { path: '/wishlist', icon: FiHeart, label: 'WISHLIST' },
  { path: '/profile/change-password', icon: FiLock, label: 'CHANGE PASSWORD' },
]
```

**Features:**
- ✅ Icon + label + description for each item
- ✅ Active state (red border + red icon)
- ✅ Hover: red border + scale 102%
- ✅ Logout button at bottom (red hover)
- ✅ Bold uppercase typography
- ✅ Square icon boxes
- ✅ Responsive (stack on mobile)

**Styling:**
```css
Item:      2px black border
           4px padding
           Hover: red border, scale 102%

Active:    Red border
           Red background (10% opacity)
           Red icon

Icon Box:  2px border, square
           Active: red bg, white icon
           Inactive: black border, black icon

Logout:    Red hover (bg + text)
           Bottom of nav
```

---

### 4. **ProfileForm** (`src/components/profile/ProfileForm.jsx`)
**Form để update profile information**

```
┌─────────────────────────────┐
│ FULL NAME *                 │
│ [👤 NGUYEN VAN A]           │
│                             │
│ EMAIL *                     │
│ [📧 user@example.com]       │
│                             │
│ PHONE NUMBER (OPTIONAL)     │
│ [📞 0912345678]             │
│                             │
│ [💾 SAVE CHANGES]           │
└─────────────────────────────┘
```

**Features:**
- ✅ Full name field (required, min 2 chars)
- ✅ Email field (required, valid format)
- ✅ Phone number field (optional, valid format)
- ✅ Client-side validation
- ✅ Error display (per field)
- ✅ Icons on left
- ✅ Loading state (button disabled)
- ✅ Update callback
- ✅ Pre-fill with user data

**Validation:**
```javascript
// Full name
- Required
- Min 2 characters

// Email
- Required
- Valid email format

// Phone (optional)
- Valid phone format (numbers, +, -, spaces, ())
```

**Styling:**
```css
Inputs:    2px black border
           Red focus border
           Icon on left
           Bold uppercase (full name)

Button:    Black bg → Red hover
           Save icon
           Scale 102% hover
           Disabled: opacity 50%
```

---

### 5. **ProfilePage** (`src/pages/ProfilePage.jsx`)
**Main profile page với two-column layout**

```
┌────────────────────────────────────────┐
│ Breadcrumb: HOME > MY ACCOUNT          │
├────────────────────────────────────────┤
│ 👤 MY PROFILE                          │
│ WELCOME BACK, NGUYEN!                  │
├─────────────┬──────────────────────────┤
│ AccountNav  │ PERSONAL INFORMATION     │
│ (Sidebar)   │ Update your details...   │
│             │                          │
│ MY PROFILE  │ [Profile Form]           │
│ ADDRESSES   │                          │
│ MY ORDERS   │                          │
│ WISHLIST    │                          │
│ PASSWORD    │ ─────────────────────── │
│ LOGOUT      │ ACCOUNT INFORMATION      │
│             │ [Role] [Member Since]    │
└─────────────┴──────────────────────────┘
```

**Layout:**
- ✅ Two-column grid (1:3 ratio on desktop)
- ✅ Left: AccountNav (sidebar)
- ✅ Right: Profile content
- ✅ Stack on mobile (AccountNav on top)

**Features:**
- ✅ Fetch profile on mount (GET /users/me)
- ✅ Update profile (PUT /users/me)
- ✅ Protected route (redirect if not logged in)
- ✅ Loading state (skeleton)
- ✅ Error state (retry button)
- ✅ Success toast notification
- ✅ Logout handler
- ✅ Breadcrumb navigation
- ✅ Account info display (role, member since)

**API Integration:**
```javascript
// Fetch profile
GET /users/me

Response: {
  success: true,
  data: {
    id: 1,
    fullName: "Nguyen Van A",
    email: "user@example.com",
    phoneNumber: "0912345678",
    role: "USER",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-11-27T12:00:00Z"
  }
}

// Update profile
PUT /users/me
Body: {
  fullName: "Nguyen Van A",
  email: "user@example.com",
  phoneNumber: "0912345678"
}

Response: {
  success: true,
  data: { ...updated user data },
  message: "Profile updated successfully"
}
```

**Flow:**
1. Check authentication → redirect if not logged in
2. Fetch profile (GET /users/me)
3. Display form with pre-filled data
4. User edits fields
5. Submit form
6. Validate → show errors if invalid
7. PUT /users/me
8. Success → update localStorage → show toast
9. Error → show error message

**Additional Info Section:**
```
┌──────────────┬──────────────┐
│ ROLE         │ MEMBER SINCE │
│ USER         │ JAN 2025     │
└──────────────┴──────────────┘
```

---

## 🎨 Streetwear Design Elements

### Typography
```css
Page Title:   font-display (Bebas Neue), 4xl-6xl
              UPPERCASE, BOLD, GLITCH effect

Nav Labels:   UPPERCASE, BOLD, TRACKING-WIDER
              text-sm, font-black

Descriptions: font-medium, text-xs
              Gray color

Form Labels:  UPPERCASE, BOLD, TRACKING-WIDER
              text-xs, font-black

Inputs:       font-bold
              Uppercase (full name)
```

### Colors
```css
Background:   #FFFFFF (Pure White)
Text:         #000000 (Pure Black)
Accent:       #FF0000 (Pure Red) - active, hover, errors
Success:      #00FF00 (Neon Green) - toast
Border:       #000000 2-4px solid
Input Focus:  #FF0000 (Red border)
```

### Layout
```css
Two-Column Grid:
  Desktop (lg):  1:3 ratio (sidebar:content)
  Mobile:        Stack (sidebar on top)

Sidebar Width:   1/4 of container
Content Width:   3/4 of container

Spacing:         8 units (2rem) between columns
```

### Components
```css
Cards:       2-4px black border
             White background
             Subtle grunge effect (noise overlay optional)

Nav Items:   2px border
             Active: red border + icon
             Hover: red border + scale

Form Inputs: 2px border
             Red focus border
             Icon left side

Buttons:     Black bg → Red hover
             Scale 102% hover
             Bold uppercase
```

---

## 📡 API Integration

### Get Profile
```javascript
GET /users/me
Headers: {
  Authorization: Bearer <access_token>
}

Response (Success):
{
  success: true,
  data: {
    id: 1,
    fullName: "Nguyen Van A",
    email: "user@example.com",
    phoneNumber: "0912345678",
    role: "USER",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-11-27T12:00:00Z"
  }
}

Response (Unauthorized):
{
  success: false,
  message: "Unauthorized",
  errorCode: "AUTH_UNAUTHORIZED"
}
```

### Update Profile
```javascript
PUT /users/me
Headers: {
  Authorization: Bearer <access_token>
}
Body: {
  fullName: "Nguyen Van B",
  email: "newuser@example.com",
  phoneNumber: "0987654321"
}

Response (Success):
{
  success: true,
  data: { ...updated user data },
  message: "Profile updated successfully"
}

Response (Error):
{
  success: false,
  message: "Email already exists",
  errorCode: "USER_EMAIL_EXISTS"
}
```

---

## 🎯 Features Checklist

### Header Dropdown
- [x] Hover trigger (show/hide)
- [x] Conditional rendering (logged in vs not)
- [x] User name display (first name)
- [x] Logged in menu (profile, orders, logout)
- [x] Not logged in menu (login, register)
- [x] Dropdown positioning (right-aligned)
- [x] Hover styles (black/red)
- [x] Icons for each item
- [x] Auto-update on auth change
- [x] Click outside to close

### AccountNav
- [x] Navigation items (5 items)
- [x] Icon + label + description
- [x] Active state detection
- [x] Active styling (red border)
- [x] Hover effects (scale, border)
- [x] Logout button at bottom
- [x] Responsive (stack mobile)

### ProfileForm
- [x] Full name field (validation)
- [x] Email field (validation)
- [x] Phone field (optional, validation)
- [x] Client-side validation
- [x] Error display (per field)
- [x] Icons on fields
- [x] Submit button (save icon)
- [x] Loading state
- [x] Pre-fill with user data
- [x] Update callback

### ProfilePage
- [x] Two-column layout
- [x] AccountNav sidebar
- [x] ProfileForm content
- [x] Fetch profile (API)
- [x] Update profile (API)
- [x] Protected route (auth check)
- [x] Loading state (skeleton)
- [x] Error state (retry)
- [x] Success toast
- [x] Logout handler
- [x] Breadcrumb navigation
- [x] Account info display
- [x] Update localStorage
- [x] Responsive layout

---

## 🚀 Routes Added

```javascript
// Profile page
/profile

// Profile sub-pages (placeholders)
/profile/addresses
/profile/change-password
```

---

## 📱 Responsive Design

### Desktop (≥ 1024px):
```
┌──────────────────────────────┐
│ ┌─────┐  ┌─────────────────┐ │
│ │     │  │                 │ │
│ │ Nav │  │   Content       │ │
│ │     │  │                 │ │
│ └─────┘  └─────────────────┘ │
└──────────────────────────────┘
   1/4         3/4
```

### Mobile (< 1024px):
```
┌──────────────────┐
│                  │
│   Nav (full)     │
│                  │
├──────────────────┤
│                  │
│   Content        │
│   (full)         │
│                  │
└──────────────────┘
```

---

## 💡 Usage Examples

### Check User in Header:
```javascript
// Header.jsx
const [user, setUser] = useState(null);

useEffect(() => {
  const currentUser = authService.getCurrentUser();
  setUser(currentUser);
}, []);

// Render
{user ? (
  <span>{user.fullName.split(' ')[0]}</span>
) : null}
```

### Protected Route:
```javascript
// ProfilePage.jsx
useEffect(() => {
  if (!authService.isAuthenticated()) {
    toast.error('PLEASE LOGIN FIRST!');
    navigate('/login', { 
      state: { from: { pathname: '/profile' } } 
    });
    return;
  }
  
  fetchProfile();
}, []);
```

### Update Profile:
```javascript
const handleUpdateProfile = async (formData) => {
  const response = await userService.updateMyProfile(formData);
  
  if (response.success) {
    // Update localStorage
    const currentAuth = {
      accessToken: localStorage.getItem('d4k_access_token'),
      refreshToken: localStorage.getItem('d4k_refresh_token'),
      user: response.data
    };
    authService.saveAuthData(currentAuth);
    
    toast.success('PROFILE UPDATED!');
  }
};
```

---

## 📊 Statistics

```
📦 Components: 4 components (AccountNav, ProfileForm, ProfilePage, Header update)
📄 Files: 5 files (1 service + 3 components + 1 page)
💻 Lines: ~800 lines
🎨 Layout: Two-column (sidebar + content)
📱 Responsive: Yes
🎯 Features: 25+ features
⚡ API Calls: 2 endpoints (get, update)
🎭 Effects: Hover dropdown, scale, active states
🔒 Protected: Yes (auth check)
```

---

## 🔧 Testing Checklist

### Header Dropdown:
- [ ] Hover shows dropdown
- [ ] Hover away hides dropdown
- [ ] Shows correct menu (logged in vs not)
- [ ] User name displays (first name)
- [ ] Links navigate correctly
- [ ] Logout works
- [ ] Dropdown position (right-aligned)
- [ ] Hover styles work

### AccountNav:
- [ ] All links navigate correctly
- [ ] Active state highlights correct item
- [ ] Hover effects work
- [ ] Logout button works
- [ ] Icons display correctly
- [ ] Descriptions show
- [ ] Responsive (mobile stack)

### ProfileForm:
- [ ] Fields pre-fill with user data
- [ ] Full name validation works
- [ ] Email validation works
- [ ] Phone validation works (optional)
- [ ] Error messages display
- [ ] Submit updates profile
- [ ] Loading state works
- [ ] Success toast shows

### ProfilePage:
- [ ] Redirects if not logged in
- [ ] Fetches profile on mount
- [ ] Loading state shows
- [ ] Profile form displays
- [ ] Update profile works
- [ ] Account info displays
- [ ] Logout works
- [ ] Breadcrumb navigates
- [ ] Responsive layout
- [ ] Error state with retry

---

## ✅ READY TO USE!

**Status**: ✅ **PROFILE PAGE & DROPDOWN COMPLETE**  
**Updated**: November 27, 2025

**Access**: 
- Profile: `http://localhost:5173/profile` (requires login)
- Dropdown: Hover user icon in header

---

## 🎉 Summary

Profile system với đầy đủ tính năng:

### **Header Dropdown Menu**:
- ✅ Hover trigger
- ✅ Conditional (logged in vs not logged in)
- ✅ User name display
- ✅ Profile + Orders links
- ✅ Login + Register links
- ✅ Logout button (red hover)

### **Profile Page** (`/profile`):
- ✅ Two-column layout (AccountNav + ProfileForm)
- ✅ Fetch profile (GET /users/me)
- ✅ Update profile (PUT /users/me)
- ✅ Protected route (auth check)
- ✅ Loading + error states
- ✅ Account info display
- ✅ Breadcrumb navigation

### **AccountNav**:
- ✅ 5 navigation items (profile, addresses, orders, wishlist, password)
- ✅ Active state (red border + icon)
- ✅ Hover effects (scale + border)
- ✅ Logout button at bottom

### **ProfileForm**:
- ✅ Full name + email + phone fields
- ✅ Validation (client-side)
- ✅ Error display
- ✅ Update functionality
- ✅ Loading state

**STREETWEAR PROFILE IS LIVE!** 👤🔥⚫⚪

