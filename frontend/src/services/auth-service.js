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
   * Request a password reset link
   * @param {string} email - The user's email address
   * @returns {Promise}
   */
  forgotPassword: async (email) => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset user's password
   * @param {string} token - The reset token received via email
   * @param {string} newPassword - The new password
   * @returns {Promise}
   */
  resetPassword: async (token, newPassword) => {
    return await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  /**
   * Logout user
   * Call backend to clear cookie, then clear user data
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error('Logout API failed', e);
    }
    
    // Clear legacy tokens if any
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
   * Since token is now HttpOnly cookie, we check if user object exists
   * @returns {Boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('d4k_user');
  },

  /**
   * Save auth data to localStorage
   * @param {Object} data - { data.token, refreshToken, user }
   */
  saveAuthData: (data) => {
    // Token is now handled by HttpOnly cookie from backend response automatically
    if (data.user) {
      localStorage.setItem('d4k_user', JSON.stringify(data.user));
    }

    // Dispatch custom event to notify components about auth changes
    window.dispatchEvent(new Event('d4k-auth-change'));
  },
};

export default authService;

