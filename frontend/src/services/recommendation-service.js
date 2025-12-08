import apiClient from './api-client';

/**
 * Recommendation Service
 * API calls cho recommendation system
 */
const recommendationService = {
  /**
   * Lấy sản phẩm tương tự (cùng category)
   * @param {Number} productId - ID sản phẩm đang xem
   * @param {Number} limit - Số lượng tối đa (default: 8)
   * @returns {Promise}
   */
  getSimilarProducts: (productId, limit = 8) => {
    return apiClient.get(`/recommendations/similar/${productId}`, {
      params: { limit },
    });
  },

  /**
   * Lấy sản phẩm phổ biến (được mua nhiều nhất)
   * @param {Number} limit - Số lượng tối đa (default: 8)
   * @returns {Promise}
   */
  getPopularProducts: (limit = 8) => {
    return apiClient.get('/recommendations/popular', {
      params: { limit },
    });
  },
};

export default recommendationService;
