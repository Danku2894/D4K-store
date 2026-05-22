
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
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
import ForgotPasswordPage from '@pages/ForgotPasswordPage';
import ResetPasswordPage from '@pages/ResetPasswordPage';
import PaymentCallbackPage from '@pages/PaymentCallbackPage';
import AboutPage from '@pages/AboutPage';
import ContactPage from '@pages/info/ContactPage';
import { ShippingPage, ReturnsPage, FAQPage, TermsPage, PrivacyPage } from '@pages/info/StaticPages';

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

import ProtectedRoute from '@components/layout/ProtectedRoute';
import AdminRoute from '@components/layout/AdminRoute';

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

import ScrollToTop from '@components/common/ScrollToTop';
function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
        {/* Public Routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Info Pages */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Quick Links Redirects */}
          <Route path="/new-arrivals" element={<Navigate to="/products?sort=createdAt,desc" replace />} />
          <Route path="/sale" element={<Navigate to="/products?isSale=true" replace />} />
          
          {/* Protected Routes (Require Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<PaymentCallbackPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/addresses" element={<AddressesPage />} />
            <Route path="/profile/password" element={<ChangePasswordPage />} />
            <Route path="/profile/orders" element={<OrdersPage />} />
            <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          <Route path="*" element={
            <div className="container-street py-20 text-center">
              <h1 className="text-9xl font-display font-black text-dark-950 mb-4">404</h1>
              <p className="text-gray-600 text-xl font-bold uppercase tracking-wide mb-8">Page not found</p>
              <a href="/" className="btn-street">Go Home</a>
            </div>
          } />
        </Route>

        {/* Admin Routes - Standalone (Protected by AdminRoute) */}
        {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/media" element={<AdminMedia />} />
        </Route>
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0a0a0a',
            color: '#f8f9fa',
            border: '2px solid #f8f9fa',
            borderRadius: '0',
            boxShadow: '6px 6px 0px 0px rgba(255,255,255,1)',
            fontWeight: '900',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '16px 24px',
            fontFamily: '"Oswald", system-ui, sans-serif'
          },
          success: {
            icon: null,
            style: {
              border: '2px solid #00FF00',
              boxShadow: '6px 6px 0px 0px #00FF00',
            },
          },
          error: {
            icon: null,
            style: {
              border: '2px solid #FF0000',
              boxShadow: '6px 6px 0px 0px #FF0000',
            },
          },
        }}
      />
      </Router>
    </HelmetProvider>
  );
}

export default App;
