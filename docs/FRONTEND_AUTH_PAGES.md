# 🔐 Authentication Pages - D4K E-commerce

## ✅ Status: COMPLETE

Đã hoàn thành Login & Register Pages với phong cách **Streetwear/Bad Habits** - minimal, bold typography, black/white/red colors.

---

## 📦 Components Created

### 1. **AuthService** (`src/services/auth-service.js`)
**API Methods:**
```javascript
login(credentials)                 // POST /auth/login
register(userData)                 // POST /auth/register
logout()                          // Clear tokens & user data
getCurrentUser()                  // Get user from localStorage
isAuthenticated()                 // Check if user logged in
saveAuthData(data)                // Save tokens & user to localStorage
```

**Token Storage:**
```javascript
// localStorage keys (TODO: Use httpOnly cookies in production)
d4k_access_token    // JWT access token
d4k_refresh_token   // JWT refresh token
d4k_user            // User object (JSON)
```

---

### 2. **LoginPage** (`src/pages/LoginPage.jsx`)
**Login form with authentication**

```
┌────────────────────────────────┐
│                                │
│      WELCOME BACK              │ (graffiti font)
│   LOGIN TO YOUR ACCOUNT        │
│   ──────  ●  ──────            │
│                                │
├────────────────────────────────┤
│ EMAIL *                        │
│ [📧 input]                     │
│                                │
│ PASSWORD *                     │
│ [🔒 input]            [👁]     │
│                                │
│               FORGOT PASSWORD? │
│                                │
│ [LOGIN]                        │ (black → red hover)
│                                │
│ ────── OR CONTINUE WITH ────── │
│                                │
│ [🔍 GOOGLE] [📘 FACEBOOK]      │
│                                │
│ Don't have an account?         │
│ REGISTER NOW                   │
├────────────────────────────────┤
│ ← BACK TO HOME                 │
└────────────────────────────────┘
```

**Features:**
- ✅ Email + password form
- ✅ Show/hide password toggle
- ✅ Client-side validation (email format, required)
- ✅ API call: POST /auth/login
- ✅ Save tokens to localStorage
- ✅ Redirect to intended page or home
- ✅ Error handling (display errors)
- ✅ Loading state (button disabled)
- ✅ Social login buttons (UI only)
- ✅ Link to Register, Forgot Password
- ✅ Redirect if already logged in

**Form State:**
```javascript
{
  email: '',
  password: ''
}
```

**Validation:**
```javascript
// Email
- Required
- Valid email format (regex)

// Password
- Required
```

**API Request:**
```javascript
POST /auth/login
Body: {
  email: "user@example.com",
  password: "password123"
}

Response: {
  success: true,
  data: {
    accessToken: "eyJhbGciOiJIUzI1...",
    refreshToken: "eyJhbGciOiJIUzI1...",
    user: {
      id: 1,
      fullName: "Nguyen Van A",
      email: "user@example.com",
      role: "USER"
    }
  }
}
```

**Flow:**
1. User fills email + password
2. Click LOGIN button
3. Validate form → show errors if invalid
4. POST /auth/login
5. Success → save tokens + user → redirect
6. Error → show error message

**Redirect Logic:**
```javascript
// If user came from protected page (e.g. /checkout)
const from = location.state?.from?.pathname || '/';
navigate(from, { replace: true });
```

---

### 3. **RegisterPage** (`src/pages/RegisterPage.jsx`)
**Registration form with password strength**

```
┌────────────────────────────────┐
│                                │
│         JOIN D4K               │ (graffiti font)
│   CREATE YOUR ACCOUNT          │
│   ──────  ●  ──────            │
│                                │
├────────────────────────────────┤
│ FULL NAME *                    │
│ [👤 input]                     │
│                                │
│ EMAIL *                        │
│ [📧 input]                     │
│                                │
│ PASSWORD *                     │
│ [🔒 input]            [👁]     │
│ PASSWORD STRENGTH: STRONG      │
│ [████████░░░░░░]               │ (5 bars)
│ Use 8+ characters...           │
│                                │
│ CONFIRM PASSWORD *             │
│ [🔒 input]            [👁]     │
│ ✓ PASSWORDS MATCH              │
│                                │
│ ☑ I agree to T&C               │
│                                │
│ [CREATE ACCOUNT]               │ (black → red hover)
│                                │
│ ────── OR SIGN UP WITH ────── │
│                                │
│ [🔍 GOOGLE] [📘 FACEBOOK]      │
│                                │
│ Already have an account?       │
│ LOGIN HERE                     │
├────────────────────────────────┤
│ ← BACK TO HOME                 │
└────────────────────────────────┘
```

**Features:**
- ✅ Full name + email + password + confirm password
- ✅ Show/hide password toggles (both fields)
- ✅ Password strength indicator (visual + label)
- ✅ Password match check (with checkmark)
- ✅ Client-side validation
- ✅ API call: POST /auth/register
- ✅ Redirect to login after success
- ✅ Error handling (display errors)
- ✅ Loading state (button disabled)
- ✅ Social signup buttons (UI only)
- ✅ Terms & Conditions checkbox
- ✅ Link to Login
- ✅ Redirect if already logged in

**Form State:**
```javascript
{
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
}
```

**Validation:**
```javascript
// Full name
- Required
- Min 2 characters

// Email
- Required
- Valid email format (regex)

// Password
- Required
- Min 8 characters

// Confirm password
- Required
- Must match password
```

**Password Strength:**
```javascript
// Criteria (5 points total)
1. Length >= 8 chars
2. Length >= 12 chars
3. Has lowercase AND uppercase
4. Has numbers
5. Has special characters

// Labels
0-2 points: WEAK (red)
3 points:   MEDIUM (yellow)
4-5 points: STRONG (green)
```

**API Request:**
```javascript
POST /auth/register
Body: {
  fullName: "Nguyen Van A",
  email: "newuser@example.com",
  password: "SecurePass123!"
}

Response: {
  success: true,
  data: {
    id: 123,
    fullName: "Nguyen Van A",
    email: "newuser@example.com",
    role: "USER"
  },
  message: "Registration successful"
}
```

**Flow:**
1. User fills all fields
2. Password strength updates live
3. Confirm password shows match status
4. Click CREATE ACCOUNT
5. Validate form → show errors if invalid
6. POST /auth/register
7. Success → show success toast → redirect to login
8. Error → show error message

**Post-Registration Options:**
```javascript
// Option 1: Redirect to login (current)
navigate('/login', { 
  state: { message: 'Registration successful!' } 
});

// Option 2: Auto-login (commented out)
if (response.data?.accessToken) {
  authService.saveAuthData(response.data);
  navigate('/');
}
```

---

## 🎨 Streetwear Design Elements

### Typography
```css
Page Title:   font-display (Bebas Neue), 5xl-6xl
              UPPERCASE, BOLD, GLITCH effect
              "WELCOME BACK" / "JOIN D4K"

Labels:       UPPERCASE, BOLD, TRACKING-WIDER
              text-xs, font-black

Inputs:       font-bold (email, password)
              UPPERCASE (full name)

Links:        font-black, UPPERCASE, TRACKING-WIDE
              Hover: red color

Helper Text:  font-medium, text-xs
              Gray color
```

### Colors
```css
Background:   #FFFFFF (Pure White)
Text:         #000000 (Pure Black)
Accent:       #FF0000 (Pure Red) - button hover, links, errors
Success:      #00FF00 (Neon Green) - toast, password match
Warning:      #FFD700 (Yellow) - medium password
Border:       #000000 2-4px solid
Input Focus:  #FF0000 (Red border)
```

### Form Elements
```css
Card:       4px black border
            White background
            Centered, max-width 28rem

Inputs:     2px black border
            White background
            Red focus border
            Icon on left
            Toggle on right (password)
            Padding: 12px

Buttons:    Black bg, white text
            Red bg on hover
            Scale 102% on hover
            Square (no rounded)
            Bold uppercase

Social:     Black border, transparent bg
            Black bg on hover, white text
            Icons: emoji (🔍, 📘)

Strength:   5 bars (flex-1 each)
            2px black border
            Red/Yellow/Green fill
```

### Effects
```css
- Scale effect (buttons: 102%)
- Glitch text (title)
- Show/hide password animation
- Loading state (opacity 50%)
- Error shake animation (optional)
```

---

## 📡 API Integration

### Login

**Request:**
```javascript
POST /auth/login
Content-Type: application/json

Body: {
  email: "user@example.com",
  password: "password123"
}
```

**Response (Success):**
```javascript
HTTP 200 OK

{
  success: true,
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIs...",
    refreshToken: "eyJhbGciOiJIUzI1NiIs...",
    user: {
      id: 1,
      fullName: "Nguyen Van A",
      email: "user@example.com",
      role: "USER",
      createdAt: "2025-01-01T00:00:00Z"
    }
  },
  message: "Login successful"
}
```

**Response (Error):**
```javascript
HTTP 401 Unauthorized

{
  success: false,
  message: "Invalid email or password",
  errorCode: "AUTH_INVALID_CREDENTIALS"
}
```

### Register

**Request:**
```javascript
POST /auth/register
Content-Type: application/json

Body: {
  fullName: "Nguyen Van B",
  email: "newuser@example.com",
  password: "SecurePass123!"
}
```

**Response (Success):**
```javascript
HTTP 201 Created

{
  success: true,
  data: {
    id: 123,
    fullName: "Nguyen Van B",
    email: "newuser@example.com",
    role: "USER",
    createdAt: "2025-11-27T12:00:00Z"
  },
  message: "Registration successful"
}
```

**Response (Error - Email exists):**
```javascript
HTTP 400 Bad Request

{
  success: false,
  message: "Email already exists",
  errorCode: "AUTH_EMAIL_EXISTS"
}
```

---

## 🎯 Features Checklist

### Login Page
- [x] Email + password form
- [x] Show/hide password toggle
- [x] Client-side validation
- [x] Email format validation
- [x] Required field validation
- [x] Error display (per field + general)
- [x] API call (POST /auth/login)
- [x] Save tokens to localStorage
- [x] Save user data
- [x] Redirect after success
- [x] Redirect to intended page
- [x] Loading state
- [x] Disabled state
- [x] Social login buttons (UI only)
- [x] Link to Register
- [x] Link to Forgot Password
- [x] Back to Home link
- [x] Redirect if already logged in

### Register Page
- [x] Full name + email + password + confirm form
- [x] Show/hide password toggles (both)
- [x] Client-side validation
- [x] Full name validation (min 2 chars)
- [x] Email format validation
- [x] Password length validation (min 8)
- [x] Password match validation
- [x] Password strength indicator
- [x] Password strength label (weak/medium/strong)
- [x] Password strength colors
- [x] Password match checkmark
- [x] Error display (per field + general)
- [x] API call (POST /auth/register)
- [x] Redirect to login after success
- [x] Success toast notification
- [x] Loading state
- [x] Disabled state
- [x] Social signup buttons (UI only)
- [x] Terms & Conditions checkbox
- [x] Link to Login
- [x] Back to Home link
- [x] Redirect if already logged in

### Auth Service
- [x] login() method
- [x] register() method
- [x] logout() method
- [x] getCurrentUser() method
- [x] isAuthenticated() method
- [x] saveAuthData() method
- [x] localStorage integration
- [x] TODO comment for httpOnly cookies

---

## 🚀 Routes Added

```javascript
// Login page
/login

// Register page
/register

// Placeholder (future)
/forgot-password
```

---

## 📱 Responsive Design

### Layout:
```
All devices: Centered card
             Full-height flex container
             Padding on mobile

Card width:  max-w-md (28rem / 448px)
             Full width on mobile (with padding)
```

### Mobile Optimizations:
- ✅ Full-width inputs
- ✅ Touch-friendly buttons (larger tap targets)
- ✅ Social buttons stack if needed (grid-cols-2)
- ✅ Font sizes adjust (responsive text-5xl → text-6xl)
- ✅ Adequate spacing for thumb navigation

---

## 💡 Security Considerations

### Current Implementation:
```javascript
// Tokens stored in localStorage
localStorage.setItem('d4k_access_token', token);
localStorage.setItem('d4k_refresh_token', token);
```

### Production Recommendations (TODO):
```javascript
// 1. Use httpOnly cookies for tokens
// More secure, not accessible via JavaScript
// Prevents XSS attacks

// 2. Implement CSRF protection
// Use CSRF tokens with cookies

// 3. Use HTTPS only
// Encrypt all traffic

// 4. Implement refresh token rotation
// New refresh token with each use

// 5. Add token expiration handling
// Auto-refresh or redirect to login

// 6. Implement rate limiting
// Prevent brute force attacks (backend)

// 7. Add password complexity requirements
// Enforce strong passwords (backend)

// 8. Implement account lockout
// After multiple failed attempts (backend)
```

### Client-Side Security:
- ✅ No sensitive data in state (only email, no password storage)
- ✅ Clear password fields after error
- ✅ Validate input format (email, password length)
- ✅ HTTPS enforced (production)
- ⚠️ Tokens in localStorage (migrate to httpOnly cookies)

---

## 🔧 Usage Examples

### Check Authentication:
```javascript
import authService from '@services/auth-service';

// Check if logged in
if (authService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = authService.getCurrentUser();
console.log(user.fullName); // "Nguyen Van A"
```

### Protected Route:
```javascript
// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    // Redirect to login with intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Usage in App.jsx
<Route 
  path="/checkout" 
  element={
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  } 
/>
```

### Logout:
```javascript
import authService from '@services/auth-service';
import { useNavigate } from 'react-router-dom';

const handleLogout = () => {
  authService.logout();
  navigate('/');
  toast.success('LOGGED OUT!');
};
```

### Update Header (Show User Info):
```javascript
// Header.jsx
const [user, setUser] = useState(authService.getCurrentUser());

useEffect(() => {
  // Listen for storage changes (login/logout)
  const handleStorageChange = () => {
    setUser(authService.getCurrentUser());
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);

// Render
{user ? (
  <div>Welcome, {user.fullName}</div>
) : (
  <Link to="/login">LOGIN</Link>
)}
```

---

## 📊 Statistics

```
📦 Components: 2 pages (Login, Register)
📄 Files: 4 new files (2 pages + 1 service + 1 doc)
💻 Lines: ~1300 lines
🎨 Forms: 2 complete forms
📱 Responsive: Yes
🎯 Features: 40+ features
⚡ API Calls: 2 endpoints (login, register)
🎭 Effects: Scale, glitch, show/hide, strength indicator
🔒 Security: localStorage (TODO: httpOnly cookies)
```

---

## 🔧 Testing Checklist

### Login Page:
- [ ] Email validation (format, required)
- [ ] Password validation (required)
- [ ] Show/hide password toggle
- [ ] Submit with valid credentials
- [ ] Submit with invalid credentials
- [ ] Error display (general + field-specific)
- [ ] Loading state (button disabled)
- [ ] Success redirect (home)
- [ ] Success redirect (intended page)
- [ ] Social buttons (toast only)
- [ ] Link to Register
- [ ] Link to Forgot Password
- [ ] Back to Home
- [ ] Already logged in redirect

### Register Page:
- [ ] Full name validation (required, min 2)
- [ ] Email validation (format, required)
- [ ] Password validation (required, min 8)
- [ ] Confirm password validation (match)
- [ ] Password strength indicator (weak/medium/strong)
- [ ] Password strength colors (red/yellow/green)
- [ ] Password match checkmark
- [ ] Show/hide password toggles (both)
- [ ] Submit with valid data
- [ ] Submit with invalid data
- [ ] Submit with mismatched passwords
- [ ] Submit with existing email
- [ ] Error display (general + field-specific)
- [ ] Loading state (button disabled)
- [ ] Success redirect (login)
- [ ] Success toast
- [ ] Social buttons (toast only)
- [ ] Terms checkbox
- [ ] Link to Login
- [ ] Back to Home
- [ ] Already logged in redirect

---

## ✅ READY TO USE!

**Status**: ✅ **AUTH PAGES COMPLETE**  
**Updated**: November 27, 2025

**Access**: 
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`

---

## 🎉 Summary

Auth Pages với đầy đủ tính năng:

### **Login Page** (`/login`):
- ✅ Email + password form
- ✅ Show/hide password
- ✅ Validation (client-side)
- ✅ API: POST /auth/login
- ✅ Save tokens + user to localStorage
- ✅ Redirect to intended page or home
- ✅ Error handling
- ✅ Social login (UI only)
- ✅ Links (Register, Forgot Password, Home)

### **Register Page** (`/register`):
- ✅ Full form (name, email, password, confirm)
- ✅ Show/hide passwords (both fields)
- ✅ Password strength indicator (5 bars, weak/medium/strong)
- ✅ Password match check (with checkmark)
- ✅ Validation (client-side)
- ✅ API: POST /auth/register
- ✅ Redirect to login after success
- ✅ Error handling
- ✅ Social signup (UI only)
- ✅ Terms & Conditions checkbox
- ✅ Links (Login, Home)

### **Auth Service**:
- ✅ login(), register(), logout()
- ✅ getCurrentUser(), isAuthenticated()
- ✅ saveAuthData() (localStorage)
- ✅ TODO: httpOnly cookies for production

**STREETWEAR AUTH IS LIVE!** 🔐🔥⚫⚪

