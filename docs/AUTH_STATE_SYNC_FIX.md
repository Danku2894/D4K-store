# 🔧 Auth State Sync Fix - D4K E-commerce

## ❌ Vấn Đề

**Mô tả:**
- Đăng nhập thành công → redirect về Home
- Header vẫn hiện nút "LOGIN / REGISTER" (không update user)
- Click "Profile" → redirect về Login page
- User state không được sync giữa các components

**Root Cause:**
1. Header component chỉ check user **1 lần** khi mount
2. Không có cơ chế notify components khi auth state changes
3. Components không biết khi nào user login/logout

---

## ✅ Giải Pháp

### 1. **Custom Event System**

Tạo event `d4k-auth-change` để notify tất cả components khi auth state thay đổi.

**File: `frontend/src/services/auth-service.js`**

```javascript
// Khi SAVE auth data (login, update profile)
saveAuthData: (data) => {
  // Save to localStorage
  if (data.accessToken) {
    localStorage.setItem('d4k_access_token', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('d4k_refresh_token', data.refreshToken);
  }
  if (data.user) {
    localStorage.setItem('d4k_user', JSON.stringify(data.user));
  }

  // 🔥 Dispatch event to notify all components
  window.dispatchEvent(new Event('d4k-auth-change'));
},

// Khi LOGOUT
logout: () => {
  // Clear localStorage
  localStorage.removeItem('d4k_access_token');
  localStorage.removeItem('d4k_refresh_token');
  localStorage.removeItem('d4k_user');

  // 🔥 Dispatch event to notify all components
  window.dispatchEvent(new Event('d4k-auth-change'));
},
```

---

### 2. **Header Listen Event**

Header component listen cho `d4k-auth-change` event và auto-update user state.

**File: `frontend/src/components/layout/Header.jsx`**

```javascript
// Check authentication status
useEffect(() => {
  const currentUser = authService.getCurrentUser();
  setUser(currentUser);

  // 🔥 Listen for auth changes (login/logout)
  const handleAuthChange = () => {
    const updatedUser = authService.getCurrentUser();
    setUser(updatedUser);
  };

  window.addEventListener('d4k-auth-change', handleAuthChange);

  return () => {
    window.removeEventListener('d4k-auth-change', handleAuthChange);
  };
}, []);
```

**Flow:**
1. User login → `authService.saveAuthData()` called
2. Event `d4k-auth-change` dispatched
3. Header catches event → calls `handleAuthChange()`
4. Header re-fetches user from localStorage
5. UI updates to show user info + profile menu

---

### 3. **ProfilePage Fallback**

Thêm fallback để show cached user info nếu API `/users/me` fail.

**File: `frontend/src/pages/ProfilePage.jsx`**

```javascript
const fetchProfile = async () => {
  try {
    setLoading(true);
    const response = await userService.getMyProfile();

    if (response.success && response.data) {
      setUser(response.data);
      authService.saveAuthData({
        accessToken: localStorage.getItem('d4k_access_token'),
        refreshToken: localStorage.getItem('d4k_refresh_token'),
        user: response.data
      });
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    
    // If 401, logout and redirect
    if (err.status === 401) {
      authService.logout();
      navigate('/login');
      return;
    }
    
    // 🔥 Fallback: use cached user data from localStorage
    const localUser = authService.getCurrentUser();
    if (localUser) {
      setUser(localUser);
      toast('SHOWING CACHED PROFILE', { icon: 'ℹ️' });
    } else {
      toast.error('FAILED TO LOAD PROFILE');
    }
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Event Flow Diagram

```
┌─────────────────────────────────────────┐
│ USER ACTIONS                            │
└─────────────────────────────────────────┘
            │
            ├─ Login Success
            │  └─> authService.saveAuthData()
            │      └─> dispatch('d4k-auth-change')
            │          └─> Header.handleAuthChange()
            │              └─> setUser(updatedUser)
            │                  └─> UI shows user info ✅
            │
            ├─ Logout
            │  └─> authService.logout()
            │      └─> dispatch('d4k-auth-change')
            │          └─> Header.handleAuthChange()
            │              └─> setUser(null)
            │                  └─> UI shows login/register ✅
            │
            └─ Update Profile
               └─> authService.saveAuthData()
                   └─> dispatch('d4k-auth-change')
                       └─> Header.handleAuthChange()
                           └─> setUser(updatedUser)
                               └─> UI shows updated info ✅
```

---

## 📋 Files Changed

1. ✅ **`frontend/src/services/auth-service.js`**
   - Added `window.dispatchEvent()` to `saveAuthData()`
   - Added `window.dispatchEvent()` to `logout()`

2. ✅ **`frontend/src/components/layout/Header.jsx`**
   - Added event listener for `d4k-auth-change`
   - Auto-update user state when event fires

3. ✅ **`frontend/src/pages/ProfilePage.jsx`**
   - Added fallback to use cached user data
   - Better error handling for 401

---

## 🧪 Testing Scenarios

### Scenario 1: Login Success
```
1. User NOT logged in
   → Header shows: [LOGIN] [REGISTER] ✅

2. Click LOGIN → fill form → submit
   → API success → save tokens
   → dispatch('d4k-auth-change')
   → Header catches event

3. Redirect to Home
   → Header shows: [NGUYEN] [Profile dropdown] ✅

4. Click Profile icon → shows dropdown
   → MY PROFILE ✅
   → MY ORDERS ✅
   → LOGOUT ✅
```

### Scenario 2: Navigate to Profile
```
1. User logged in
   → Header shows: [NGUYEN] [Profile dropdown] ✅

2. Click "MY PROFILE" in dropdown
   → Navigate to /profile
   → ProfilePage checks: isAuthenticated() ✅
   → Fetch profile: GET /users/me

3. If API success:
   → Show profile form with data ✅

4. If API fails (backend not ready):
   → Fallback to localStorage user ✅
   → Show cached profile data ✅
   → Toast: "SHOWING CACHED PROFILE" ℹ️
```

### Scenario 3: Logout
```
1. User logged in
   → Header shows: [NGUYEN] [Profile dropdown] ✅

2. Click "LOGOUT" in dropdown
   → authService.logout()
   → Clear localStorage
   → dispatch('d4k-auth-change')

3. Header catches event
   → setUser(null)
   → Header shows: [LOGIN] [REGISTER] ✅

4. Redirect to Home
   → Toast: "LOGGED OUT SUCCESSFULLY!" 👋
```

### Scenario 4: Update Profile
```
1. User on /profile
   → Edit name, email, phone
   → Click "SAVE CHANGES"

2. API: PUT /users/me
   → Success → new user data
   → authService.saveAuthData(newData)
   → dispatch('d4k-auth-change')

3. Header catches event
   → setUser(updatedUser)
   → Header shows: [NEW_NAME] ✅

4. Profile page also updated ✅
```

---

## 🔑 Key Benefits

1. **✅ Real-time Sync**: All components update immediately when auth state changes
2. **✅ No Manual Refresh**: No need to reload page to see changes
3. **✅ Centralized Logic**: Auth state management in one place (`auth-service.js`)
4. **✅ Event-Driven**: Components don't need to poll or check repeatedly
5. **✅ Scalable**: Easy to add more components that need auth state

---

## 🚀 Usage in Other Components

Any component can listen for auth changes:

```javascript
// Example: SomeComponent.jsx
import { useState, useEffect } from 'react';
import authService from '@services/auth-service';

const SomeComponent = () => {
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener('d4k-auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('d4k-auth-change', handleAuthChange);
    };
  }, []);

  return (
    <div>
      {user ? `Hello, ${user.fullName}` : 'Please login'}
    </div>
  );
};
```

---

## ⚠️ Important Notes

1. **Event Name**: Always use `d4k-auth-change` (consistent naming)
2. **Cleanup**: Always remove event listener in `useEffect` cleanup
3. **localStorage Keys**: Use correct keys:
   - `d4k_access_token`
   - `d4k_refresh_token`
   - `d4k_user`
4. **API Fallback**: ProfilePage uses cached data if API fails (good for development)

---

## ✅ FIXED!

**Before:**
- ❌ Login success → Header không update
- ❌ Profile page → redirect to login
- ❌ Logout → Header không update

**After:**
- ✅ Login success → Header auto-update
- ✅ Profile page → show user info (cached or API)
- ✅ Logout → Header auto-update
- ✅ Update profile → Header auto-update

**AUTH STATE SYNC IS LIVE!** 🔐✨

