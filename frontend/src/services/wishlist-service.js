import apiClient from './api-client';

/**
 * Wishlist Service
 * Các API liên quan đến wishlist
 */
const wishlistService = {
  /**
   * Lấy wishlist của user
   * @returns {Promise}
   */
  getWishlist: () => {
    return apiClient.get('/wishlist');
  },

  /**
   * Thêm sản phẩm vào wishlist
   * @param {Object} data - { productId }
   * @returns {Promise}
   */
  addToWishlist: (data) => {
    return apiClient.post('/wishlist/add', data);
  },

  /**
   * Xóa sản phẩm khỏi wishlist
   * @param {Number} productId - Product ID
   * @returns {Promise}
   */
  removeFromWishlist: (productId) => {
    return apiClient.delete(`/wishlist/remove/${productId}`);
  },

  /**
   * Chuyển item từ wishlist sang cart
   * @param {Number} itemId - Wishlist item ID
   * @returns {Promise}
   */
  moveToCart: (itemId) => {
    return apiClient.post(`/wishlist/move-to-cart/${itemId}`);
  },
};

export default wishlistService;

