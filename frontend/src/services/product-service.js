import apiClient from './api-client';

/**
 * Product Service
 * Các API liên quan đến sản phẩm
 */
const productService = {
  /**
   * Lấy danh sách sản phẩm với filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getProducts: (params = {}) => {
    // Parse sort param into sortBy and direction for backend
    const { sort, ...otherParams } = params;
    let queryParams = { ...otherParams };
    
    if (sort) {
      const [sortBy, direction] = sort.split(',');
      queryParams.sortBy = sortBy || 'createdAt';
      queryParams.direction = direction || 'desc';
    }
    
    return apiClient.get('/products', { params: queryParams });
  },

  /**
   * Lấy sản phẩm nổi bật (Featured Products)
   * @param {Number} page - Page number (default: 0)
   * @param {Number} size - Page size (default: 8)
   * @returns {Promise}
   */
  getFeaturedProducts: (page = 0, size = 8) => {
    return apiClient.get('/products', {
      params: {
        page,
        size,
        featured: true,
      },
    });
  },

  /**
   * Lấy sản phẩm mới (New Arrivals)
   * @param {Number} page - Page number (default: 0)
   * @param {Number} size - Page size (default: 8)
   * @returns {Promise}
   */
  getNewArrivals: (page = 0, size = 8) => {
    return apiClient.get('/products', {
      params: {
        page,
        size,
        sortBy: 'createdAt',
        direction: 'desc',
      },
    });
  },

  /**
   * Lấy chi tiết sản phẩm
   * @param {Number} id - Product ID
   * @returns {Promise}
   */
  getProductById: (id) => {
    return apiClient.get(`/products/${id}`);
  },

  /**
   * Tìm kiếm sản phẩm
   * @param {String} keyword - Từ khóa tìm kiếm
   * @param {Object} params - Query parameters khác
   * @returns {Promise}
   */
  searchProducts: (keyword, params = {}) => {
    return apiClient.get('/products', {
      params: {
        search: keyword,
        ...params,
      },
    });
  },

  /**
   * Lấy sản phẩm theo category
   * @param {Number} categoryId - Category ID
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getProductsByCategory: (categoryId, params = {}) => {
    // Parse sort param into sortBy and direction for backend
    const { sort, ...otherParams } = params;
    let queryParams = { ...otherParams };
    
    if (sort) {
      const [sortBy, direction] = sort.split(',');
      queryParams.sortBy = sortBy || 'createdAt';
      queryParams.direction = direction || 'desc';
    }
    
    return apiClient.get(`/products/category/${categoryId}`, {
      params: queryParams,
    });
  },

  /**
   * Lấy sản phẩm liên quan
   * @param {Number} productId - Product ID
   * @param {Number} limit - Số lượng sản phẩm (default: 4)
   * @returns {Promise}
   */
  getRelatedProducts: (productId, limit = 4) => {
    // Lấy sản phẩm cùng category (logic có thể tùy chỉnh)
    return apiClient.get('/products', {
      params: {
        size: limit,
      },
    });
  },
  // ============ ADMIN METHODS ============

  /**
   * Lấy tất cả sản phẩm cho admin (bao gồm inactive)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAllProductsAdmin: (params = {}) => {
    return apiClient.get('/admin/products', { params });
  },

  /**
   * Tạo sản phẩm mới
   * @param {Object} data - Product data
   * @returns {Promise}
   */
  createProduct: (data) => {
    return apiClient.post('/admin/products', data);
  },

  /**
   * Cập nhật sản phẩm
   * @param {Number} id - Product ID
   * @param {Object} data - Product data
   * @returns {Promise}
   */
  updateProduct: (id, data) => {
    return apiClient.put(`/admin/products/${id}`, data);
  },

  /**
   * Xóa sản phẩm
   * @param {Number} id - Product ID
   * @returns {Promise}
   */
  deleteProduct: (id) => {
    return apiClient.delete(`/admin/products/${id}`);
  },
};

export default productService;

