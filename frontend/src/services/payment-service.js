import apiClient from './api-client';

const paymentService = {
  // Create VNPAY Payment URL
  createVnPayUrl: async (amount, orderInfo = 'Thanh toan don hang', orderId = null) => {
    try {
      const params = { amount, orderInfo };
      if (orderId) params.orderId = orderId;
      
      const response = await apiClient.get('/payment/vn-pay', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default paymentService;
