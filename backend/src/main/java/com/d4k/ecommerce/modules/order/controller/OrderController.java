package com.d4k.ecommerce.modules.order.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.order.dto.request.CancelOrderRequest;
import com.d4k.ecommerce.modules.order.dto.request.CreateOrderRequest;
import com.d4k.ecommerce.modules.order.dto.response.OrderResponse;
import com.d4k.ecommerce.modules.order.service.OrderService;
import com.d4k.ecommerce.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Order Controller
 * REST API endpoints cho user order management
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class OrderController {
    
    private final OrderService orderService;
    private final SecurityUtils securityUtils;
    
    /**
     * Tạo order mới từ cart
     * Endpoint: POST /api/v1/orders
     * Access: Authenticated USER
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request
    ) {
        Long userId = securityUtils.getCurrentUserId();
        OrderResponse response = orderService.createOrder(userId, request);
        
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order created successfully")
                .data(response)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    
    /**
     * Lấy danh sách orders của user
     * Endpoint: GET /api/v1/orders
     * Access: Authenticated USER
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Long userId = securityUtils.getCurrentUserId();
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<OrderResponse> ordersPage = orderService.getUserOrders(userId, pageable);
        
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
     * Lấy chi tiết order
     * Endpoint: GET /api/v1/orders/{id}
     * Access: Authenticated USER (owner only)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        OrderResponse response = orderService.getOrderById(id, userId);
        
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Order fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Hủy order
     * Endpoint: PUT /api/v1/orders/{id}/cancel
     * Access: Authenticated USER (owner only)
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request
    ) {
        Long userId = securityUtils.getCurrentUserId();
        orderService.cancelOrder(id, userId, request);
        
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Order cancelled successfully")
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
}

