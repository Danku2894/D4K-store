-- =====================================================
-- Migration: V15 - Extend Coupons Expiry
-- Description: Cập nhật hạn sử dụng của các coupon mẫu do đã bị hết hạn
-- =====================================================

UPDATE coupons
SET end_date = CURRENT_TIMESTAMP + INTERVAL '365 days',
    start_date = CURRENT_TIMESTAMP - INTERVAL '1 days',
    is_active = true
WHERE code IN ('WELCOME10', 'FLASH50', 'VIP20', 'NEWYEAR15', 'FREESHIP30');
