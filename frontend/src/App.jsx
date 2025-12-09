
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import HomePage from '@pages/HomePage';
import CategoriesPage from '@pages/CategoriesPage';
import ProductsPage from '@pages/ProductsPage';
import CategoryPage from '@pages/CategoryPage';
import ProductDetailPage from '@pages/ProductDetailPage';
import CartPage from '@pages/CartPage';
import CheckoutPage from '@pages/CheckoutPage';
import OrderSuccessPage from '@pages/OrderSuccessPage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';

import ProfilePage from '@pages/ProfilePage';
import WishlistPage from '@pages/WishlistPage';
// import AdminLoginPage from '@pages/admin/AdminLoginPage';
import AdminDashboard from '@pages/admin/AdminDashboard';

import AdminProducts from '@pages/admin/AdminProducts';
import AdminCategories from '@pages/admin/AdminCategories';
import AdminOrders from '@pages/admin/AdminOrders';
import AdminOrderDetailPage from '@pages/admin/AdminOrderDetailPage';
import AdminUsers from '@pages/admin/AdminUsers';
import AdminCoupons from '@pages/admin/AdminCoupons';
import AdminMedia from '@pages/admin/AdminMedia';

import AddressesPage from '@pages/profile/AddressesPage';
import ChangePasswordPage from '@pages/profile/ChangePasswordPage';
import OrdersPage from '@pages/profile/OrdersPage';
import OrderDetailPage from '@pages/profile/OrderDetailPage';

/**
 * Public Layout Component
 * Header + Footer + Main Content
 */
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

/**
 * Main App Component
 * Router và layout chính
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/addresses" element={<AddressesPage />} />
          <Route path="/profile/password" element={<ChangePasswordPage />} />
          <Route path="/profile/orders" element={<OrdersPage />} />
          <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<div className="container-street py-20 text-dark-950 text-center font-bold">About Page (Coming Soon)</div>} />
          <Route path="*" element={
            <div className="container-street py-20 text-center">
              <h1 className="text-9xl font-display font-black text-dark-950 mb-4">404</h1>
              <p className="text-gray-600 text-xl font-bold uppercase tracking-wide mb-8">Page not found</p>
              <a href="/" className="btn-street">Go Home</a>
            </div>
          } />
        </Route>

        {/* Admin Routes - Standalone (Internal AdminLayout or Login) */}
        {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/coupons" element={<AdminCoupons />} />
        <Route path="/admin/media" element={<AdminMedia />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '2px solid #000000',
            borderRadius: '0',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
          success: {
            iconTheme: {
              primary: '#000000',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF0000',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
