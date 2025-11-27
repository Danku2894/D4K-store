-- Create products table
-- Migration V5: Product Management

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url VARCHAR(500),
    category_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE RESTRICT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_product_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_product_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_product_active ON products(is_active);

-- Add comments
COMMENT ON TABLE products IS 'Products - fashion items for sale';
COMMENT ON COLUMN products.price IS 'Product price - must be positive';
COMMENT ON COLUMN products.stock IS 'Available stock quantity';
COMMENT ON COLUMN products.is_active IS 'Product visibility - inactive products hidden from public';
COMMENT ON COLUMN products.category_id IS 'Category reference - cannot be deleted if products exist';

