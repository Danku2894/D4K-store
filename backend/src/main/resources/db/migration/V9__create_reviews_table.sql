-- =====================================================
-- Migration: V9 - Create Reviews Table
-- Description: Tạo bảng reviews để lưu đánh giá sản phẩm
-- Author: D4K E-commerce Team
-- Date: 2025-11-27
-- =====================================================

-- Create reviews table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_review_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_review_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(id) 
        ON DELETE CASCADE,
    
    -- Unique constraint: 1 user chỉ review 1 product 1 lần
    CONSTRAINT uk_user_product_review 
        UNIQUE (user_id, product_id)
);

-- Create indexes for performance
CREATE INDEX idx_review_product ON reviews(product_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_review_rating ON reviews(rating);
CREATE INDEX idx_review_created_at ON reviews(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE reviews IS 'Bảng lưu trữ đánh giá sản phẩm từ khách hàng';
COMMENT ON COLUMN reviews.id IS 'ID tự động tăng';
COMMENT ON COLUMN reviews.user_id IS 'ID của user đánh giá';
COMMENT ON COLUMN reviews.product_id IS 'ID của sản phẩm được đánh giá';
COMMENT ON COLUMN reviews.rating IS 'Điểm đánh giá (1-5 sao)';
COMMENT ON COLUMN reviews.comment IS 'Nội dung đánh giá';
COMMENT ON COLUMN reviews.created_at IS 'Thời gian tạo review';

