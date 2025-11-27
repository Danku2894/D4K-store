-- Create cart tables
-- Migration V7: Cart Management

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) 
        REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    
    -- Unique constraint: 1 product chỉ xuất hiện 1 lần trong cart
    CONSTRAINT uk_cart_product UNIQUE (cart_id, product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cart_user ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_product ON cart_items(product_id);

-- Add comments
COMMENT ON TABLE carts IS 'Shopping carts - one per user';
COMMENT ON TABLE cart_items IS 'Items in shopping cart';
COMMENT ON COLUMN cart_items.quantity IS 'Quantity of product in cart - must be positive';
COMMENT ON CONSTRAINT uk_cart_product ON cart_items IS 'Ensure one product appears only once per cart';

