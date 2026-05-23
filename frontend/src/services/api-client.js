import axios from 'axios';

/**
 * API Client Configuration
 * Base URL sẽ dùng proxy từ Vite config
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Auto send HttpOnly cookies
});

/**
 * Request Interceptor
 * Cũ: Tự động thêm JWT token vào header.
 * Mới: Không cần thêm JWT token nữa vì đã dùng HttpOnly Cookie.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Optionally we can still check for old token here or just return config
    const token = localStorage.getItem('d4k_access_token');
    if (token && token !== 'null' && token !== 'undefined') {
      // Keep it for backward compatibility if user hasn't cleared local storage yet
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
        
        // Prevent infinite loop if already on login page or if the request is to login API
        const isLoginPage = window.location.pathname.includes('/login');
        const isLoginApi = error.config && error.config.url && error.config.url.includes('/login');
        
        if (!isLoginPage && !isLoginApi) {
          window.location.href = '/login';
        }
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

