-- =====================================================
-- Migration: V11 - Create Coupons Table
-- Description: Tạo bảng coupons để quản lý mã giảm giá
-- Author: D4K E-commerce Team
-- Date: 2025-11-27
-- =====================================================

-- Create coupons table
CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order_amount DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    usage_limit INTEGER CHECK (usage_limit > 0),
    usage_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: start_date phải trước end_date
    CONSTRAINT chk_coupon_dates CHECK (start_date < end_date),
    
    -- Constraint: usage_count không vượt quá usage_limit
    CONSTRAINT chk_coupon_usage CHECK (usage_limit IS NULL OR usage_count <= usage_limit),
    
    -- Unique constraint cho code
    CONSTRAINT uk_coupon_code UNIQUE (code)
);

-- Create indexes for performance
CREATE INDEX idx_coupon_code ON coupons(code);
CREATE INDEX idx_coupon_dates ON coupons(start_date, end_date);
CREATE INDEX idx_coupon_active ON coupons(is_active);
CREATE INDEX idx_coupon_valid ON coupons(is_active, start_date, end_date) 
    WHERE is_active = true;

-- Add comments for documentation
COMMENT ON TABLE coupons IS 'Bảng lưu trữ mã giảm giá / coupons';
COMMENT ON COLUMN coupons.id IS 'ID tự động tăng';
COMMENT ON COLUMN coupons.code IS 'Mã coupon (unique, uppercase)';
COMMENT ON COLUMN coupons.name IS 'Tên / mô tả ngắn của coupon';
COMMENT ON COLUMN coupons.description IS 'Mô tả chi tiết';
COMMENT ON COLUMN coupons.discount_type IS 'Loại giảm giá: PERCENTAGE (%) hoặc FIXED_AMOUNT (VND)';
COMMENT ON COLUMN coupons.discount_value IS 'Giá trị giảm: % (0-100) hoặc số tiền cố định';
COMMENT ON COLUMN coupons.min_order_amount IS 'Giá trị đơn hàng tối thiểu để áp dụng';
COMMENT ON COLUMN coupons.max_discount IS 'Số tiền giảm tối đa (cho PERCENTAGE)';
COMMENT ON COLUMN coupons.start_date IS 'Ngày bắt đầu hiệu lực';
COMMENT ON COLUMN coupons.end_date IS 'Ngày hết hiệu lực';
COMMENT ON COLUMN coupons.usage_limit IS 'Giới hạn số lần sử dụng (NULL = không giới hạn)';
COMMENT ON COLUMN coupons.usage_count IS 'Số lần đã sử dụng';
COMMENT ON COLUMN coupons.is_active IS 'Trạng thái active/inactive';
COMMENT ON COLUMN coupons.created_at IS 'Thời gian tạo';
COMMENT ON COLUMN coupons.updated_at IS 'Thời gian cập nhật';

