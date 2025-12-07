import apiClient from './api-client';

const orderService = {
  getMyOrders: async (params) => {
    const response = await apiClient.get('/orders', { params });
    return response;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response;
  },

  createOrder: async (data) => {
    const response = await apiClient.post('/orders', data);
    return response;
  },

  cancelOrder: async (id, reason) => {
    const response = await apiClient.put(`/orders/${id}/cancel`, { cancelReason: reason });
    return response;
  },
  
  // ============ ADMIN METHODS ============

  getAllOrders: async (params = {}) => {
    const response = await apiClient.get('/admin/orders', { params });
    return response;
  },

  searchOrders: async (keyword, params = {}) => {
    const response = await apiClient.get('/admin/orders/search', {
      params: { keyword, ...params }
    });
    return response;
  },

  getOrderByIdAdmin: async (id) => {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return response;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return response;
  }
};

export default orderService;
