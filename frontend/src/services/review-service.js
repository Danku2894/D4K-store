import apiClient from './api-client';

/**
 * Review Service
 * Các API liên quan đến reviews
 */
const reviewService = {
  /**
   * Lấy reviews của sản phẩm
   * @param {Number} productId - Product ID
   * @param {Object} params - Query parameters (page, size)
   * @returns {Promise}
   */
  getProductReviews: (productId, params = {}) => {
    return apiClient.get(`/reviews/product/${productId}`, { params });
  },

  /**
   * Tạo review mới
   * @param {Object} reviewData - { productId, rating, comment }
   * @returns {Promise}
   */
  createReview: (reviewData) => {
    return apiClient.post('/reviews', reviewData);
  },

  /**
   * Xóa review
   * @param {Number} reviewId - Review ID
   * @returns {Promise}
   */
  deleteReview: (reviewId) => {
    return apiClient.delete(`/reviews/${reviewId}`);
  },

  /**
   * Lấy review của user cho sản phẩm
   * @param {Number} productId - Product ID
   * @returns {Promise}
   */
  getUserReview: (productId) => {
    return apiClient.get(`/reviews/my-review/${productId}`);
  },
};

export default reviewService;

