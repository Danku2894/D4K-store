-- Create categories table
-- Migration V3: Category Management

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) 
        REFERENCES categories(id) ON DELETE RESTRICT
);

-- Create index for parent_id (faster queries for children)
CREATE INDEX IF NOT EXISTS idx_category_parent ON categories(parent_id);

-- Create index for name (faster search)
CREATE INDEX IF NOT EXISTS idx_category_name ON categories(name);

-- Add comments
COMMENT ON TABLE categories IS 'Product categories - hierarchical structure with parent-child relationships';
COMMENT ON COLUMN categories.parent_id IS 'Parent category ID - NULL for root categories';
COMMENT ON COLUMN categories.name IS 'Category name - must be unique';

