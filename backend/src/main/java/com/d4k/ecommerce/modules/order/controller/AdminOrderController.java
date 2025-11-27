package com.d4k.ecommerce.modules.order.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.order.dto.request.UpdateOrderStatusRequest;
import com.d4k.ecommerce.modules.order.dto.response.OrderResponse;
import com.d4k.ecommerce.modules.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin Order Controller
 * REST API endpoints cho admin quản lý orders
 */
@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {
    
    private final OrderService orderService;
    
    /**
     * Lấy tất cả orders
     * Endpoint: GET /api/v1/admin/orders
     * Access: ADMIN only
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<OrderResponse> ordersPage = orderService.getAllOrders(pageable);
        
        PageResponse<OrderResponse> pageResponse = PageResponse.<OrderResponse>builder()
                .content(ordersPage.getContent())
                .page(ordersPage.getNumber())
                .size(ordersPage.getSize())
                .totalElements(ordersPage.getTotalElements())
                .totalPages(ordersPage.getTotalPages())
                .last(ordersPage.isLast())
                .build();
        
        ApiResponse<PageResponse<OrderResponse>> apiResponse = 
                ApiResponse.<PageResponse<OrderResponse>>builder()
                .success(true)
                .message("Orders fetched successfully")
                .data(pageResponse)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Search orders
     * Endpoint: GET /api/v1/admin/orders/search
     * Access: ADMIN only
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> searchOrders(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderResponse> ordersPage = orderService.searchOrders(keyword, pageable);
        
        PageResponse<OrderResponse> pageResponse = PageResponse.<OrderResponse>builder()
                .content(ordersPage.getContent())
                .page(ordersPage.getNumber())
                .size(ordersPage.getSize())
                .totalElements(ordersPage.getTotalElements())
                .totalPages(ordersPage.getTotalPages())
                .last(ordersPage.isLast())
                .build();
        
        ApiResponse<PageResponse<OrderResponse>> apiResponse = 
                ApiResponse.<PageResponse<OrderResponse>>builder()
                .success(true)
                .message("Orders searched successfully")
                .data(pageResponse)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Lấy chi tiết order
     * Endpoint: GET /api/v1/admin/orders/{id}
     * Access: ADMIN only
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderByIdAdmin(id);
        
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Update order status
     * Endpoint: PUT /api/v1/admin/orders/{id}/status
     * Access: ADMIN only
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order status updated successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
}

