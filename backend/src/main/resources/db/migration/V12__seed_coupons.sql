-- =====================================================
-- Migration: V12 - Seed Sample Coupons
-- Description: Thêm dữ liệu mẫu cho coupons
-- Author: D4K E-commerce Team
-- Date: 2025-11-27
-- =====================================================

-- Coupon giảm 10% (không giới hạn, active)
INSERT INTO coupons (
    code, name, description, discount_type, discount_value,
    min_order_amount, max_discount, start_date, end_date,
    usage_limit, usage_count, is_active, created_at, updated_at
) VALUES (
    'WELCOME10',
    'Chào mừng khách hàng mới',
    'Giảm 10% cho đơn hàng đầu tiên, áp dụng cho đơn từ 200,000 VND',
    'PERCENTAGE',
    10.00,
    200000.00,
    50000.00,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '90 days',
    NULL,
    0,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Coupon giảm 50,000 VND (giới hạn 100 lần)
INSERT INTO coupons (
    code, name, description, discount_type, discount_value,
    min_order_amount, max_discount, start_date, end_date,
    usage_limit, usage_count, is_active, created_at, updated_at
) VALUES (
    'FLASH50',
    'Flash Sale - Giảm 50K',
    'Giảm ngay 50,000 VND cho đơn hàng từ 500,000 VND. Số lượng có giới hạn!',
    'FIXED_AMOUNT',
    50000.00,
    500000.00,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    100,
    15,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Coupon giảm 20% cho đơn lớn (VIP)
INSERT INTO coupons (
    code, name, description, discount_type, discount_value,
    min_order_amount, max_discount, start_date, end_date,
    usage_limit, usage_count, is_active, created_at, updated_at
) VALUES (
    'VIP20',
    'VIP - Giảm 20%',
    'Giảm 20% cho đơn hàng từ 1,000,000 VND. Tối đa 200,000 VND',
    'PERCENTAGE',
    20.00,
    1000000.00,
    200000.00,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    50,
    5,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Coupon giảm 100,000 VND (inactive - đã hết hạn)
INSERT INTO coupons (
    code, name, description, discount_type, discount_value,
    min_order_amount, max_discount, start_date, end_date,
    usage_limit, usage_count, is_active, created_at, updated_at
) VALUES (
    'SUMMER100',
    'Khuyến mãi hè',
    'Giảm 100,000 VND - Chương trình đã kết thúc',
    'FIXED_AMOUNT',
    100000.00,
    800000.00,
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '60 days',
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    200,
    200,
    false,
    CURRENT_TIMESTAMP - INTERVAL '60 days',
    CURRENT_TIMESTAMP
);

-- Coupon giảm 15% (sắp bắt đầu)
INSERT INTO coupons (
    code, name, description, discount_type, discount_value,
    min_order_amount, max_discount, start_date, end_date,
    usage_limit, usage_count, is_active, created_at, updated_at
) VALUES (
    'NEWYEAR15',
    'Tết 2026 - Giảm 15%',
    'Giảm 15% cho mọi đơn hàng từ 300,000 VND. Chương trình sắp bắt đầu!',
    'PERCENTAGE',
    15.00,
    300000.00,
    100000.00,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    CURRENT_TIMESTAMP + INTERVAL '37 days',
    NULL,
    0,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Coupon freeship (giảm 30,000 VND)
INSERT INTO coupons (
    code, name, description, discount_type, discount_value,
    min_order_amount, max_discount, start_date, end_date,
    usage_limit, usage_count, is_active, created_at, updated_at
) VALUES (
    'FREESHIP30',
    'Miễn phí vận chuyển',
    'Giảm 30,000 VND phí vận chuyển cho đơn từ 150,000 VND',
    'FIXED_AMOUNT',
    30000.00,
    150000.00,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '60 days',
    500,
    127,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

COMMENT ON TABLE coupons IS 'Coupons đã được seed với dữ liệu mẫu cho testing';

