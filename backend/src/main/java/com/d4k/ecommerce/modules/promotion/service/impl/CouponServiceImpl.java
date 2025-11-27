package com.d4k.ecommerce.modules.promotion.service.impl;

import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.modules.promotion.dto.request.ApplyCouponRequest;
import com.d4k.ecommerce.modules.promotion.dto.request.CouponRequest;
import com.d4k.ecommerce.modules.promotion.dto.response.CouponResponse;
import com.d4k.ecommerce.modules.promotion.dto.response.CouponValidationResponse;
import com.d4k.ecommerce.modules.promotion.entity.Coupon;
import com.d4k.ecommerce.modules.promotion.enums.DiscountType;
import com.d4k.ecommerce.modules.promotion.mapper.CouponMapper;
import com.d4k.ecommerce.modules.promotion.repository.CouponRepository;
import com.d4k.ecommerce.modules.promotion.service.CouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

/**
 * Coupon Service Implementation
 * Xử lý business logic cho coupons
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {
    
    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;
    
    /**
     * Tạo coupon mới
     */
    @Override
    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        log.info("Creating coupon with code: {}", request.getCode());
        
        // Validate code uniqueness
        if (couponRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new BusinessException("Coupon code already exists", "COUPON_CODE_EXISTS");
        }
        
        // Validate dates
        validateDates(request.getStartDate(), request.getEndDate());
        
        // Validate discount value theo type
        validateDiscountValue(request.getDiscountType(), request.getDiscountValue());
        
        // Uppercase code
        String code = request.getCode().toUpperCase();
        
        Coupon coupon = Coupon.builder()
                .code(code)
                .name(request.getName())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxDiscount(request.getMaxDiscount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .usageCount(0)
                .isActive(request.getIsActive())
                .build();
        
        Coupon savedCoupon = couponRepository.save(coupon);
        log.info("Coupon created successfully with ID: {}", savedCoupon.getId());
        
        return couponMapper.toResponse(savedCoupon);
    }
    
    /**
     * Cập nhật coupon
     */
    @Override
    @Transactional
    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        log.info("Updating coupon ID: {}", id);
        
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        
        // Check code uniqueness nếu thay đổi code
        if (!coupon.getCode().equalsIgnoreCase(request.getCode())) {
            if (couponRepository.existsByCodeIgnoreCase(request.getCode())) {
                throw new BusinessException("Coupon code already exists", "COUPON_CODE_EXISTS");
            }
            coupon.setCode(request.getCode().toUpperCase());
        }
        
        // Validate dates
        validateDates(request.getStartDate(), request.getEndDate());
        
        // Validate discount value
        validateDiscountValue(request.getDiscountType(), request.getDiscountValue());
        
        // Update fields
        coupon.setName(request.getName());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderAmount(request.getMinOrderAmount());
        coupon.setMaxDiscount(request.getMaxDiscount());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setIsActive(request.getIsActive());
        
        Coupon updatedCoupon = couponRepository.save(coupon);
        log.info("Coupon updated successfully: {}", updatedCoupon.getId());
        
        return couponMapper.toResponse(updatedCoupon);
    }
    
    /**
     * Xóa coupon
     */
    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        log.info("Deleting coupon ID: {}", id);
        
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon", "id", id);
        }
        
        couponRepository.deleteById(id);
        log.info("Coupon deleted successfully: {}", id);
    }
    
    /**
     * Lấy chi tiết coupon
     */
    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        log.info("Fetching coupon ID: {}", id);
        
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        
        return couponMapper.toResponse(coupon);
    }
    
    /**
     * Lấy tất cả coupons (ADMIN)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CouponResponse> getAllCoupons(Pageable pageable) {
        log.info("Fetching all coupons");
        
        Page<Coupon> coupons = couponRepository.findAll(pageable);
        
        return coupons.map(couponMapper::toResponse);
    }
    
    /**
     * Lấy coupons đang valid (PUBLIC)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CouponResponse> getValidCoupons(Pageable pageable) {
        log.info("Fetching valid coupons");
        
        LocalDateTime now = LocalDateTime.now();
        Page<Coupon> coupons = couponRepository.findValidCoupons(now, pageable);
        
        return coupons.map(couponMapper::toResponse);
    }
    
    /**
     * Search coupons
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CouponResponse> searchCoupons(String keyword, Pageable pageable) {
        log.info("Searching coupons with keyword: {}", keyword);
        
        Page<Coupon> coupons = couponRepository.searchCoupons(keyword, pageable);
        
        return coupons.map(couponMapper::toResponse);
    }
    
    /**
     * Apply coupon và tính discount
     */
    @Override
    @Transactional
    public CouponValidationResponse applyCoupon(ApplyCouponRequest request) {
        log.info("Applying coupon: {} for order amount: {}", request.getCode(), request.getOrderAmount());
        
        // Tìm coupon
        LocalDateTime now = LocalDateTime.now();
        Coupon coupon = couponRepository.findValidCouponByCode(request.getCode(), now)
                .orElseThrow(() -> new BusinessException("Invalid or expired coupon code", "INVALID_COUPON"));
        
        // Validate min order amount
        if (coupon.getMinOrderAmount() != null && 
            request.getOrderAmount().compareTo(coupon.getMinOrderAmount()) < 0) {
            
            String message = String.format("Minimum order amount is %s VND", 
                coupon.getMinOrderAmount().toPlainString());
            
            return CouponValidationResponse.builder()
                    .code(coupon.getCode())
                    .name(coupon.getName())
                    .isValid(false)
                    .message(message)
                    .originalAmount(request.getOrderAmount())
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(request.getOrderAmount())
                    .build();
        }
        
        // Tính discount amount
        BigDecimal discountAmount = calculateDiscount(coupon, request.getOrderAmount());
        BigDecimal finalAmount = request.getOrderAmount().subtract(discountAmount);
        
        // Ensure final amount không âm
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }
        
        log.info("Coupon applied successfully. Discount: {}, Final: {}", discountAmount, finalAmount);
        
        return CouponValidationResponse.builder()
                .code(coupon.getCode())
                .name(coupon.getName())
                .isValid(true)
                .message("Coupon applied successfully")
                .originalAmount(request.getOrderAmount())
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .build();
    }
    
    /**
     * Verify coupon code
     */
    @Override
    @Transactional(readOnly = true)
    public CouponResponse verifyCouponCode(String code) {
        log.info("Verifying coupon code: {}", code);
        
        LocalDateTime now = LocalDateTime.now();
        Coupon coupon = couponRepository.findValidCouponByCode(code, now)
                .orElseThrow(() -> new BusinessException("Invalid or expired coupon code", "INVALID_COUPON"));
        
        return couponMapper.toResponse(coupon);
    }
    
    // ============== PRIVATE HELPER METHODS ==============
    
    /**
     * Validate dates
     */
    private void validateDates(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BusinessException("Start date must be before end date", "INVALID_DATE_RANGE");
        }
    }
    
    /**
     * Validate discount value theo type
     */
    private void validateDiscountValue(DiscountType type, BigDecimal value) {
        if (type == DiscountType.PERCENTAGE) {
            if (value.compareTo(BigDecimal.ZERO) <= 0 || value.compareTo(new BigDecimal("100")) > 0) {
                throw new BusinessException("Percentage discount must be between 0 and 100", "INVALID_DISCOUNT_VALUE");
            }
        } else {
            if (value.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException("Fixed discount must be greater than 0", "INVALID_DISCOUNT_VALUE");
            }
        }
    }
    
    /**
     * Tính discount amount
     */
    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discount;
        
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            // Tính % discount
            discount = orderAmount
                    .multiply(coupon.getDiscountValue())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            
            // Apply max discount nếu có
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else {
            // Fixed amount discount
            discount = coupon.getDiscountValue();
            
            // Ensure không discount nhiều hơn order amount
            if (discount.compareTo(orderAmount) > 0) {
                discount = orderAmount;
            }
        }
        
        return discount.setScale(2, RoundingMode.HALF_UP);
    }
}

