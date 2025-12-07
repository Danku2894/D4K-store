import apiClient from './api-client';

/**
 * Cart Service
 * Các API liên quan đến shopping cart
 */
const cartService = {
  /**
   * Lấy giỏ hàng của user
   * @returns {Promise}
   */
  getCart: () => {
    return apiClient.get('/cart');
  },

  /**
   * Thêm sản phẩm vào giỏ
   * @param {Object} data - { productId, quantity }
   * @returns {Promise}
   */
  addToCart: (data) => {
    return apiClient.post('/cart/add', data);
  },

  /**
   * Cập nhật quantity của item
   * @param {Number} itemId - Cart item ID
   * @param {Object} data - { quantity }
   * @returns {Promise}
   */
  updateCartItem: (itemId, data) => {
    return apiClient.put(`/cart/update/${itemId}`, data);
  },

  /**
   * Xóa item khỏi giỏ
   * @param {Number} itemId - Cart item ID
   * @returns {Promise}
   */
  removeCartItem: (itemId) => {
    return apiClient.delete(`/cart/remove/${itemId}`);
  },

  /**
   * Xóa toàn bộ giỏ hàng
   * @returns {Promise}
   */
  clearCart: () => {
    return apiClient.delete('/cart/clear');
  },
};

export default cartService;

