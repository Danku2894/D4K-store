package com.d4k.ecommerce.modules.promotion.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.promotion.dto.request.ApplyCouponRequest;
import com.d4k.ecommerce.modules.promotion.dto.response.CouponResponse;
import com.d4k.ecommerce.modules.promotion.dto.response.CouponValidationResponse;
import com.d4k.ecommerce.modules.promotion.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Coupon Controller
 * REST API endpoints cho public coupon operations
 */
@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {
    
    private final CouponService couponService;
    
    /**
     * Lấy danh sách coupons đang valid
     * Endpoint: GET /api/v1/coupons
     * Access: Public
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CouponResponse>>> getValidCoupons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CouponResponse> couponsPage = couponService.getValidCoupons(pageable);
        
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
                .message("Valid coupons fetched successfully")
                .data(pageResponse)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Verify coupon code
     * Endpoint: GET /api/v1/coupons/verify/{code}
     * Access: Public
     */
    @GetMapping("/verify/{code}")
    public ResponseEntity<ApiResponse<CouponResponse>> verifyCoupon(@PathVariable String code) {
        CouponResponse response = couponService.verifyCouponCode(code);
        
        ApiResponse<CouponResponse> apiResponse = ApiResponse.<CouponResponse>builder()
                .success(true)
                .message("Coupon is valid")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Apply coupon và tính discount
     * Endpoint: POST /api/v1/coupons/apply
     * Access: Public
     */
    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> applyCoupon(
            @Valid @RequestBody ApplyCouponRequest request
    ) {
        CouponValidationResponse response = couponService.applyCoupon(request);
        
        ApiResponse<CouponValidationResponse> apiResponse = 
                ApiResponse.<CouponValidationResponse>builder()
                .success(response.getIsValid())
                .message(response.getMessage())
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
}

