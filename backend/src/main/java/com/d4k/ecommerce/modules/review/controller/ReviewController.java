package com.d4k.ecommerce.modules.review.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.review.dto.request.ReviewRequest;
import com.d4k.ecommerce.modules.review.dto.response.ReviewResponse;
import com.d4k.ecommerce.modules.review.service.ReviewService;
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

import java.util.HashMap;
import java.util.Map;

/**
 * Review Controller
 * REST API endpoints cho review management
 */
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    private final SecurityUtils securityUtils;
    
    /**
     * Tạo review mới
     * Endpoint: POST /api/v1/reviews
     * Access: Authenticated USER
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request
    ) {
        Long userId = securityUtils.getCurrentUserId();
        ReviewResponse response = reviewService.createReview(userId, request);
        
        ApiResponse<ReviewResponse> apiResponse = ApiResponse.<ReviewResponse>builder()
                .success(true)
                .message("Review created successfully")
                .data(response)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    
    /**
     * Lấy danh sách reviews của một product
     * Endpoint: GET /api/v1/reviews/product/{productId}
     * Access: Public
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ReviewResponse> reviewsPage = reviewService.getProductReviews(productId, pageable);
        
        // Lấy thêm thống kê rating
        Double avgRating = reviewService.getAverageRating(productId);
        Long totalReviews = reviewService.getReviewCount(productId);
        
        PageResponse<ReviewResponse> pageResponse = PageResponse.<ReviewResponse>builder()
                .content(reviewsPage.getContent())
                .page(reviewsPage.getNumber())
                .size(reviewsPage.getSize())
                .totalElements(reviewsPage.getTotalElements())
                .totalPages(reviewsPage.getTotalPages())
                .last(reviewsPage.isLast())
                .build();
        
        // Thêm metadata về rating
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("averageRating", avgRating);
        metadata.put("totalReviews", totalReviews);
        
        ApiResponse<PageResponse<ReviewResponse>> apiResponse = ApiResponse.<PageResponse<ReviewResponse>>builder()
                .success(true)
                .message("Product reviews fetched successfully")
                .data(pageResponse)
                .metadata(metadata)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Lấy reviews của user hiện tại
     * Endpoint: GET /api/v1/reviews/my-reviews
     * Access: Authenticated USER
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getMyReviews(
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
        Page<ReviewResponse> reviewsPage = reviewService.getUserReviews(userId, pageable);
        
        PageResponse<ReviewResponse> pageResponse = PageResponse.<ReviewResponse>builder()
                .content(reviewsPage.getContent())
                .page(reviewsPage.getNumber())
                .size(reviewsPage.getSize())
                .totalElements(reviewsPage.getTotalElements())
                .totalPages(reviewsPage.getTotalPages())
                .last(reviewsPage.isLast())
                .build();
        
        ApiResponse<PageResponse<ReviewResponse>> apiResponse = ApiResponse.<PageResponse<ReviewResponse>>builder()
                .success(true)
                .message("User reviews fetched successfully")
                .data(pageResponse)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Xóa review
     * Endpoint: DELETE /api/v1/reviews/{id}
     * Access: USER (owner) hoặc ADMIN
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");
        
        // Nếu là ADMIN thì xóa trực tiếp, còn USER thì check ownership
        if (isAdmin) {
            reviewService.deleteReviewByAdmin(id);
        } else {
            reviewService.deleteReview(id, userId);
        }
        
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Review deleted successfully")
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
}

