import apiClient from './api-client';

/**
 * Category Service
 * Các API liên quan đến danh mục sản phẩm
 */
const categoryService = {
  /**
   * Lấy tất cả categories
   * @returns {Promise}
   */
  getAllCategories: () => {
    return apiClient.get('/categories');
  },

  /**
   * Lấy chi tiết category
   * @param {Number} id - Category ID
   * @returns {Promise}
   */
  getCategoryById: (id) => {
    return apiClient.get(`/categories/${id}`);
  },

  /**
   * Lấy parent categories (categories cấp cao nhất)
   * @returns {Promise}
   */
  getParentCategories: () => {
    return apiClient.get('/categories', {
      params: {
        parentId: 'null',
      },
    });
  },

  /**
   * Lấy sub-categories của một category
   * @param {Number} parentId - Parent category ID
   * @returns {Promise}
   */
  getSubCategories: (parentId) => {
    return apiClient.get('/categories', {
      params: {
        parentId,
      },
    });
  },
  // ============ ADMIN METHODS ============

  /**
   * Tạo category mới
   * @param {Object} data - Category data
   * @returns {Promise}
   */
  createCategory: (data) => {
    return apiClient.post('/admin/categories', data);
  },

  /**
   * Cập nhật category
   * @param {Number} id - Category ID
   * @param {Object} data - Category data
   * @returns {Promise}
   */
  updateCategory: (id, data) => {
    return apiClient.put(`/admin/categories/${id}`, data);
  },

  /**
   * Xóa category
   * @param {Number} id - Category ID
   * @returns {Promise}
   */
  deleteCategory: (id) => {
    return apiClient.delete(`/admin/categories/${id}`);
  },
};

export default categoryService;

