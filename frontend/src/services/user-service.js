import apiClient from './api-client';

/**
 * User Service
 * Các API liên quan đến user profile
 */
const userService = {
  /**
   * Lấy thông tin user hiện tại
   * @returns {Promise}
   */
  getMyProfile: () => {
    return apiClient.get('/users/profile');
  },

  /**
   * Cập nhật thông tin user
   * @param {Object} data - User data
   * @returns {Promise}
   */
  updateMyProfile: (data) => {
    return apiClient.put('/users/profile', data);
  },

  /**
   * Đổi mật khẩu
   * @param {Object} data - { oldPassword, newPassword }
   * @returns {Promise}
   */
  changePassword: (data) => {
    return apiClient.put('/users/change-password', data);
  },

  /**
   * Upload avatar
   * @param {File} file - Avatar file
   * @returns {Promise}
   */
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // ============ ADMIN METHODS ============

  /**
   * Lấy danh sách tất cả users (Admin)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAllUsers: (params = {}) => {
    return apiClient.get('/admin/users', { params });
  },

  /**
   * Tìm kiếm users (Admin)
   * @param {String} keyword - Keyword
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  searchUsers: (keyword, params = {}) => {
    return apiClient.get('/admin/users/search', {
      params: { keyword, ...params }
    });
  },

  /**
   * Lấy chi tiết user (Admin)
   * @param {Number} id - User ID
   * @returns {Promise}
   */
  getUserById: (id) => {
    return apiClient.get(`/admin/users/${id}`);
  },

  /**
   * Cập nhật user (Admin)
   * @param {Number} id - User ID
   * @param {Object} data - User data
   * @returns {Promise}
   */
  updateUser: (id, data) => {
    return apiClient.put(`/admin/users/${id}`, data);
  },

  /**
   * Xóa user (Admin)
   * @param {Number} id - User ID
   * @returns {Promise}
   */
  deleteUser: (id) => {
    return apiClient.delete(`/admin/users/${id}`);
  },
};

export default userService;

