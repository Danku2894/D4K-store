import apiClient from './api-client';

/**
 * Auth Service
 * Các API liên quan đến authentication
 */
const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise}
   */
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Register new user
   * @param {Object} userData - { fullName, email, password }
   * @returns {Promise}
   */
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Logout user
   * Clear tokens and user data
   */
  logout: () => {
    localStorage.removeItem('d4k_access_token');
    localStorage.removeItem('d4k_refresh_token');
    localStorage.removeItem('d4k_user');

    // Dispatch custom event to notify components about auth changes
    window.dispatchEvent(new Event('d4k-auth-change'));
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('d4k_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('d4k_access_token');
  },

  /**
   * Save auth data to localStorage
   * @param {Object} data - { data.token, refreshToken, user }
   */
  saveAuthData: (data) => {
    // TODO: Consider using httpOnly cookies for tokens in production for better security
    if (data.token) {
      localStorage.setItem('d4k_access_token', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('d4k_refresh_token', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('d4k_user', JSON.stringify(data.user));
    }

    // Dispatch custom event to notify components about auth changes
    window.dispatchEvent(new Event('d4k-auth-change'));
  },
};

export default authService;

