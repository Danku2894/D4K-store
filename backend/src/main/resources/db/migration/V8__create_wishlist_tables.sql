-- Create wishlist tables
-- Migration V8: Wishlist Management

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    wishlist_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_wishlist_item_wishlist FOREIGN KEY (wishlist_id) 
        REFERENCES wishlists(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_item_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    
    -- Unique constraint: 1 product chỉ xuất hiện 1 lần trong wishlist
    CONSTRAINT uk_wishlist_product UNIQUE (wishlist_id, product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_item_wishlist ON wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_item_product ON wishlist_items(product_id);

-- Add comments
COMMENT ON TABLE wishlists IS 'User wishlists - one per user';
COMMENT ON TABLE wishlist_items IS 'Items in wishlist';
COMMENT ON CONSTRAINT uk_wishlist_product ON wishlist_items IS 'Ensure one product appears only once per wishlist';

