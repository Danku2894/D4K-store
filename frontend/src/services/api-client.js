import axios from 'axios';

/**
 * API Client Configuration
 * Base URL sẽ dùng proxy từ Vite config
 */
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Tự động thêm JWT token vào header nếu có
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('d4k_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Xử lý response và error chung
 */
apiClient.interceptors.response.use(
  (response) => {
    // Trả về data từ response
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      // Server trả về lỗi
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - xóa token và redirect login
        localStorage.removeItem('d4k_access_token');
        localStorage.removeItem('d4k_refresh_token');
        localStorage.removeItem('d4k_user');
        window.location.href = '/login';
      }
      
      // Trả về error message từ API
      return Promise.reject(data || error);
    } else if (error.request) {
      // Request đã gửi nhưng không nhận được response
      return Promise.reject({
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      });
    } else {
      // Lỗi khác
      return Promise.reject({
        success: false,
        message: error.message || 'Có lỗi xảy ra',
      });
    }
  }
);

export default apiClient;

