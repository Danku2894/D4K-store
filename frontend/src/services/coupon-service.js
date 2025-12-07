import apiClient from './api-client';

/**
 * Coupon Service
 * Các API liên quan đến coupons
 */
const couponService = {
  /**
   * Áp dụng coupon code
   * @param {Object} data - { code, orderAmount }
   * @returns {Promise}
   */
  applyCoupon: (data) => {
    return apiClient.post('/coupons/apply', data);
  },

  /**
   * Lấy danh sách coupons available
   * @returns {Promise}
   */
  getAvailableCoupons: () => {
    return apiClient.get('/coupons');
  },

  /**
   * Validate coupon code
   * @param {String} code - Coupon code
   * @returns {Promise}
   */
  validateCoupon: (code) => {
    return apiClient.get(`/coupons/validate/${code}`);
  },
  // ============ ADMIN METHODS ============

  /**
   * Lấy tất cả coupons (Admin)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAllCoupons: (params = {}) => {
    return apiClient.get('/admin/coupons', { params });
  },

  /**
   * Tìm kiếm coupons (Admin)
   * @param {String} keyword - Keyword
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  searchCoupons: (keyword, params = {}) => {
    return apiClient.get('/admin/coupons/search', {
      params: { keyword, ...params }
    });
  },

  /**
   * Lấy chi tiết coupon (Admin)
   * @param {Number} id - Coupon ID
   * @returns {Promise}
   */
  getCouponById: (id) => {
    return apiClient.get(`/admin/coupons/${id}`);
  },

  /**
   * Tạo coupon mới (Admin)
   * @param {Object} data - Coupon data
   * @returns {Promise}
   */
  createCoupon: (data) => {
    return apiClient.post('/admin/coupons', data);
  },

  /**
   * Cập nhật coupon (Admin)
   * @param {Number} id - Coupon ID
   * @param {Object} data - Coupon data
   * @returns {Promise}
   */
  updateCoupon: (id, data) => {
    return apiClient.put(`/admin/coupons/${id}`, data);
  },

  /**
   * Xóa coupon (Admin)
   * @param {Number} id - Coupon ID
   * @returns {Promise}
   */
  deleteCoupon: (id) => {
    return apiClient.delete(`/admin/coupons/${id}`);
  },
};

export default couponService;

