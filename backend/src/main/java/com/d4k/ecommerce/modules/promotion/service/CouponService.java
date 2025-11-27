package com.d4k.ecommerce.modules.promotion.service;

import com.d4k.ecommerce.modules.promotion.dto.request.ApplyCouponRequest;
import com.d4k.ecommerce.modules.promotion.dto.request.CouponRequest;
import com.d4k.ecommerce.modules.promotion.dto.response.CouponResponse;
import com.d4k.ecommerce.modules.promotion.dto.response.CouponValidationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Coupon Service Interface
 * Định nghĩa business logic cho coupons
 */
public interface CouponService {
    
    /**
     * Tạo coupon mới (ADMIN)
     * @param request thông tin coupon
     * @return coupon đã tạo
     */
    CouponResponse createCoupon(CouponRequest request);
    
    /**
     * Cập nhật coupon (ADMIN)
     * @param id coupon ID
     * @param request thông tin mới
     * @return coupon đã cập nhật
     */
    CouponResponse updateCoupon(Long id, CouponRequest request);
    
    /**
     * Xóa coupon (ADMIN)
     * @param id coupon ID
     */
    void deleteCoupon(Long id);
    
    /**
     * Lấy chi tiết coupon
     * @param id coupon ID
     * @return coupon detail
     */
    CouponResponse getCouponById(Long id);
    
    /**
     * Lấy danh sách tất cả coupons (ADMIN)
     * @param pageable thông tin phân trang
     * @return danh sách coupons
     */
    Page<CouponResponse> getAllCoupons(Pageable pageable);
    
    /**
     * Lấy danh sách coupons đang valid (PUBLIC)
     * @param pageable thông tin phân trang
     * @return danh sách valid coupons
     */
    Page<CouponResponse> getValidCoupons(Pageable pageable);
    
    /**
     * Search coupons theo keyword (ADMIN)
     * @param keyword từ khóa tìm kiếm
     * @param pageable thông tin phân trang
     * @return danh sách coupons
     */
    Page<CouponResponse> searchCoupons(String keyword, Pageable pageable);
    
    /**
     * Validate và tính toán discount cho coupon
     * @param request coupon code và order amount
     * @return kết quả validation và discount amount
     */
    CouponValidationResponse applyCoupon(ApplyCouponRequest request);
    
    /**
     * Verify coupon code
     * @param code coupon code
     * @return coupon nếu valid
     */
    CouponResponse verifyCouponCode(String code);
}

