-- =====================================================
-- Migration: V14 - Create Addresses Table
-- Description: Tạo bảng addresses để lưu địa chỉ giao hàng của users
-- Author: D4K E-commerce Team
-- Date: 2025-11-27
-- =====================================================

-- Create addresses table
CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(500) NOT NULL,
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key
    CONSTRAINT fk_address_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_address_user ON addresses(user_id);
CREATE INDEX idx_address_default ON addresses(is_default);

-- Add comments for documentation
COMMENT ON TABLE addresses IS 'Bảng lưu trữ địa chỉ giao hàng của users';
COMMENT ON COLUMN addresses.user_id IS 'User sở hữu address này';
COMMENT ON COLUMN addresses.receiver_name IS 'Tên người nhận hàng';
COMMENT ON COLUMN addresses.phone IS 'Số điện thoại người nhận';
COMMENT ON COLUMN addresses.address IS 'Địa chỉ chi tiết';
COMMENT ON COLUMN addresses.ward IS 'Phường/Xã';
COMMENT ON COLUMN addresses.district IS 'Quận/Huyện';
COMMENT ON COLUMN addresses.city IS 'Tỉnh/Thành phố';
COMMENT ON COLUMN addresses.is_default IS 'Địa chỉ mặc định';

