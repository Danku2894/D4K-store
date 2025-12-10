package com.d4k.ecommerce.modules.order.service;

import com.d4k.ecommerce.modules.order.dto.request.CancelOrderRequest;
import com.d4k.ecommerce.modules.order.dto.request.CreateOrderRequest;
import com.d4k.ecommerce.modules.order.dto.request.UpdateOrderStatusRequest;
import com.d4k.ecommerce.modules.order.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Order Service Interface
 * Định nghĩa business logic cho orders
 */
public interface OrderService {
    
    /**
     * Tạo order từ cart của user
     * @param userId user ID
     * @param request thông tin order
     * @return order đã tạo
     */
    OrderResponse createOrder(Long userId, CreateOrderRequest request);
    
    /**
     * Lấy danh sách orders của user
     * @param userId user ID
     * @param pageable thông tin phân trang
     * @return danh sách orders
     */
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);
    
    /**
     * Lấy chi tiết order
     * @param orderId order ID
     * @param userId user ID (để check ownership)
     * @return order detail
     */
    OrderResponse getOrderById(Long orderId, Long userId);
    
    /**
     * Hủy order (User)
     * @param orderId order ID
     * @param userId user ID (để check ownership)
     * @param request thông tin hủy
     */
    void cancelOrder(Long orderId, Long userId, CancelOrderRequest request);
    
    /**
     * Lấy tất cả orders (Admin)
     * @param pageable thông tin phân trang
     * @return danh sách orders
     */
    Page<OrderResponse> getAllOrders(Pageable pageable);
    
    /**
     * Lấy chi tiết order (Admin)
     * @param orderId order ID
     * @return order detail
     */
    OrderResponse getOrderByIdAdmin(Long orderId);
    
    /**
     * Update order status (Admin)
     * @param orderId order ID
     * @param request thông tin update
     * @return updated order
     */
    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
    
    /**
     * Search orders (Admin)
     * @param keyword từ khóa tìm kiếm
     * @param pageable thông tin phân trang
     * @return danh sách orders
     */
    Page<OrderResponse> searchOrders(String keyword, Pageable pageable);
    /**
     * Update order status after payment (System)
     * @param orderId order ID
     * @param success payment success status
     */
    void updateOrderAfterPayment(Long orderId, boolean success);
}

