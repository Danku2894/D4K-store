import apiClient from './api-client';

/**
 * Admin Service
 * Các API liên quan đến admin operations
 */
const adminService = {
  // ============ DASHBOARD ============
  getDashboardOverview: () => {
    return apiClient.get('/admin/dashboard/overview');
  },

  getDashboardSales: (params = {}) => {
    return apiClient.get('/admin/dashboard/sales', { params });
  },

  getTopProducts: (params = {}) => {
    return apiClient.get('/admin/dashboard/top-products', { params });
  },

  // ============ PRODUCTS ============
  getProducts: (params = {}) => {
    return apiClient.get('/admin/products', { params });
  },

  getProductById: (id) => {
    return apiClient.get(`/admin/products/${id}`);
  },

  createProduct: (data) => {
    return apiClient.post('/admin/products', data);
  },

  updateProduct: (id, data) => {
    return apiClient.put(`/admin/products/${id}`, data);
  },

  deleteProduct: (id) => {
    return apiClient.delete(`/admin/products/${id}`);
  },

  // ============ CATEGORIES ============
  getCategories: (params = {}) => {
    return apiClient.get('/admin/categories', { params });
  },

  createCategory: (data) => {
    return apiClient.post('/admin/categories', data);
  },

  updateCategory: (id, data) => {
    return apiClient.put(`/admin/categories/${id}`, data);
  },

  deleteCategory: (id) => {
    return apiClient.delete(`/admin/categories/${id}`);
  },

  // ============ ORDERS ============
  getOrders: (params = {}) => {
    return apiClient.get('/admin/orders', { params });
  },

  getOrderById: (id) => {
    return apiClient.get(`/admin/orders/${id}`);
  },

  updateOrderStatus: (id, data) => {
    return apiClient.put(`/admin/orders/${id}/status`, data);
  },

  // ============ USERS ============
  getUsers: (params = {}) => {
    return apiClient.get('/admin/users', { params });
  },

  getUserById: (id) => {
    return apiClient.get(`/admin/users/${id}`);
  },

  updateUser: (id, data) => {
    return apiClient.put(`/admin/users/${id}`, data);
  },

  deleteUser: (id) => {
    return apiClient.delete(`/admin/users/${id}`);
  },

  // ============ COUPONS ============
  getCoupons: (params = {}) => {
    return apiClient.get('/admin/coupons', { params });
  },

  createCoupon: (data) => {
    return apiClient.post('/admin/coupons', data);
  },

  updateCoupon: (id, data) => {
    return apiClient.put(`/admin/coupons/${id}`, data);
  },

  deleteCoupon: (id) => {
    return apiClient.delete(`/admin/coupons/${id}`);
  },

  // ============ MEDIA ============
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getMedia: (params = {}) => {
    return apiClient.get('/admin/media', { params });
  },

  deleteMedia: (id) => {
    return apiClient.delete(`/admin/media/${id}`);
  },
};

export default adminService;

