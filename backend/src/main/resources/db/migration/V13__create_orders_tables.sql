-- =====================================================
-- Migration: V13 - Create Orders and Order Items Tables
-- Description: Tạo bảng orders và order_items để quản lý đơn hàng
-- Author: D4K E-commerce Team
-- Date: 2025-11-27
-- =====================================================

-- Create orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'RETURNED')),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee DECIMAL(10, 2) NOT NULL CHECK (shipping_fee >= 0),
    discount_amount DECIMAL(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    coupon_code VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO', 'CREDIT_CARD')),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    shipping_city VARCHAR(100),
    shipping_district VARCHAR(100),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancel_reason VARCHAR(500),
    
    -- Foreign key
    CONSTRAINT fk_order_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE RESTRICT
);

-- Create order_items table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    image_url VARCHAR(500),
    
    -- Foreign keys
    CONSTRAINT fk_order_item_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_order_item_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(id) 
        ON DELETE RESTRICT
);

-- Create indexes for performance
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_number ON orders(order_number);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created ON orders(created_at DESC);
CREATE INDEX idx_order_payment_status ON orders(payment_status);

CREATE INDEX idx_order_item_order ON order_items(order_id);
CREATE INDEX idx_order_item_product ON order_items(product_id);

-- Add comments for documentation
COMMENT ON TABLE orders IS 'Bảng lưu trữ đơn hàng';
COMMENT ON COLUMN orders.order_number IS 'Mã đơn hàng unique (format: ORD-YYYYMMDD-XXXXX)';
COMMENT ON COLUMN orders.status IS 'Trạng thái đơn hàng';
COMMENT ON COLUMN orders.subtotal IS 'Tổng tiền sản phẩm (trước giảm giá)';
COMMENT ON COLUMN orders.shipping_fee IS 'Phí vận chuyển';
COMMENT ON COLUMN orders.discount_amount IS 'Số tiền được giảm (từ coupon)';
COMMENT ON COLUMN orders.total_amount IS 'Tổng tiền phải trả (sau giảm giá + shipping)';
COMMENT ON COLUMN orders.payment_method IS 'Phương thức thanh toán';
COMMENT ON COLUMN orders.payment_status IS 'Trạng thái thanh toán';

COMMENT ON TABLE order_items IS 'Bảng lưu trữ chi tiết sản phẩm trong đơn hàng';
COMMENT ON COLUMN order_items.product_name IS 'Tên sản phẩm (snapshot tại thời điểm đặt)';
COMMENT ON COLUMN order_items.price IS 'Giá sản phẩm (snapshot tại thời điểm đặt)';
COMMENT ON COLUMN order_items.subtotal IS 'Thành tiền (price * quantity)';

