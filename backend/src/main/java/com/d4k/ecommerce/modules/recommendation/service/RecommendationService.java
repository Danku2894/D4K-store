package com.d4k.ecommerce.modules.recommendation.service;

import com.d4k.ecommerce.modules.product.dto.response.ProductResponse;
import java.util.List;

/**
 * Recommendation Service Interface
 * Cung cấp các phương thức đề xuất sản phẩm
 */
public interface RecommendationService {
    
    /**
     * Lấy sản phẩm tương tự (cùng category)
     * @param productId - ID sản phẩm đang xem
     * @param limit - Số lượng tối đa
     * @return Danh sách sản phẩm tương tự
     */
    List<ProductResponse> getSimilarProducts(Long productId, int limit);
    
    /**
     * Lấy sản phẩm phổ biến (được mua nhiều nhất)
     * @param limit - Số lượng tối đa
     * @return Danh sách sản phẩm phổ biến
     */
    List<ProductResponse> getPopularProducts(int limit);
}
