import apiClient from './api-client';

const dashboardService = {
  // Get dashboard overview
  getDashboardOverview: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get sales data
  getSalesData: async (period = 'DAILY', startDate, endDate) => {
    try {
      const response = await apiClient.get('/admin/dashboard/sales', {
        params: { period, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get top products
  getTopProducts: async (limit = 10) => {
    try {
      const response = await apiClient.get('/admin/dashboard/top-products', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default dashboardService;
