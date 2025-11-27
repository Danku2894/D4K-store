-- Seed sample categories
-- Migration V4: Insert sample categories for fashion e-commerce

-- Root categories
INSERT INTO categories (name, description, parent_id, created_at, updated_at)
VALUES 
    ('Men', 'Men''s fashion and accessories', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Women', 'Women''s fashion and accessories', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Kids', 'Children''s clothing and accessories', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Accessories', 'Fashion accessories for all', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Men's subcategories
INSERT INTO categories (name, description, parent_id, created_at, updated_at)
SELECT 
    name, 
    description, 
    (SELECT id FROM categories WHERE name = 'Men'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Men''s Shirts', 'Casual and formal shirts for men'),
    ('Men''s Pants', 'Trousers, jeans, and shorts'),
    ('Men''s Jackets', 'Coats and jackets'),
    ('Men''s Shoes', 'Footwear for men')
) AS subcats(name, description)
ON CONFLICT (name) DO NOTHING;

-- Women's subcategories
INSERT INTO categories (name, description, parent_id, created_at, updated_at)
SELECT 
    name, 
    description, 
    (SELECT id FROM categories WHERE name = 'Women'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Women''s Dresses', 'Elegant dresses for all occasions'),
    ('Women''s Tops', 'Blouses, shirts, and t-shirts'),
    ('Women''s Pants', 'Trousers, jeans, and skirts'),
    ('Women''s Shoes', 'Footwear for women')
) AS subcats(name, description)
ON CONFLICT (name) DO NOTHING;

-- Kids' subcategories
INSERT INTO categories (name, description, parent_id, created_at, updated_at)
SELECT 
    name, 
    description, 
    (SELECT id FROM categories WHERE name = 'Kids'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Boys', 'Clothing for boys'),
    ('Girls', 'Clothing for girls'),
    ('Baby', 'Baby clothing and accessories')
) AS subcats(name, description)
ON CONFLICT (name) DO NOTHING;

-- Accessories subcategories
INSERT INTO categories (name, description, parent_id, created_at, updated_at)
SELECT 
    name, 
    description, 
    (SELECT id FROM categories WHERE name = 'Accessories'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Bags', 'Handbags, backpacks, and wallets'),
    ('Jewelry', 'Necklaces, bracelets, and earrings'),
    ('Watches', 'Wristwatches for all'),
    ('Belts', 'Fashion belts')
) AS subcats(name, description)
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE categories IS 'Sample fashion categories seeded for demo';

