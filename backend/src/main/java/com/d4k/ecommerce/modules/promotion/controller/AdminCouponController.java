package com.d4k.ecommerce.modules.promotion.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.promotion.dto.request.CouponRequest;
import com.d4k.ecommerce.modules.promotion.dto.response.CouponResponse;
import com.d4k.ecommerce.modules.promotion.service.CouponService;
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
 * Admin Coupon Controller
 * REST API endpoints cho admin quản lý coupons
 */
@RestController
@RequestMapping("/api/v1/admin/coupons")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCouponController {
    
    private final CouponService couponService;
    
    /**
     * Tạo coupon mới
     * Endpoint: POST /api/v1/admin/coupons
     * Access: ADMIN only
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(
            @Valid @RequestBody CouponRequest request
    ) {
        CouponResponse response = couponService.createCoupon(request);
        
        ApiResponse<CouponResponse> apiResponse = ApiResponse.<CouponResponse>builder()
                .success(true)
                .message("Coupon created successfully")
                .data(response)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    
    /**
     * Cập nhật coupon
     * Endpoint: PUT /api/v1/admin/coupons/{id}
     * Access: ADMIN only
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest request
    ) {
        CouponResponse response = couponService.updateCoupon(id, request);
        
        ApiResponse<CouponResponse> apiResponse = ApiResponse.<CouponResponse>builder()
                .success(true)
                .message("Coupon updated successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Xóa coupon
     * Endpoint: DELETE /api/v1/admin/coupons/{id}
     * Access: ADMIN only
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Coupon deleted successfully")
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Lấy chi tiết coupon
     * Endpoint: GET /api/v1/admin/coupons/{id}
     * Access: ADMIN only
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponById(@PathVariable Long id) {
        CouponResponse response = couponService.getCouponById(id);
        
        ApiResponse<CouponResponse> apiResponse = ApiResponse.<CouponResponse>builder()
                .success(true)
                .message("Coupon fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Lấy tất cả coupons
     * Endpoint: GET /api/v1/admin/coupons
     * Access: ADMIN only
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CouponResponse>>> getAllCoupons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CouponResponse> couponsPage = couponService.getAllCoupons(pageable);
        
        PageResponse<CouponResponse> pageResponse = PageResponse.<CouponResponse>builder()
                .content(couponsPage.getContent())
                .page(couponsPage.getNumber())
                .size(couponsPage.getSize())
                .totalElements(couponsPage.getTotalElements())
                .totalPages(couponsPage.getTotalPages())
                .last(couponsPage.isLast())
                .build();
        
        ApiResponse<PageResponse<CouponResponse>> apiResponse = 
                ApiResponse.<PageResponse<CouponResponse>>builder()
                .success(true)
                .message("Coupons fetched successfully")
                .data(pageResponse)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Search coupons
     * Endpoint: GET /api/v1/admin/coupons/search
     * Access: ADMIN only
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<CouponResponse>>> searchCoupons(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CouponResponse> couponsPage = couponService.searchCoupons(keyword, pageable);
        
        PageResponse<CouponResponse> pageResponse = PageResponse.<CouponResponse>builder()
                .content(couponsPage.getContent())
                .page(couponsPage.getNumber())
                .size(couponsPage.getSize())
                .totalElements(couponsPage.getTotalElements())
                .totalPages(couponsPage.getTotalPages())
                .last(couponsPage.isLast())
                .build();
        
        ApiResponse<PageResponse<CouponResponse>> apiResponse = 
                ApiResponse.<PageResponse<CouponResponse>>builder()
                .success(true)
                .message("Coupons searched successfully")
                .data(pageResponse)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
}

