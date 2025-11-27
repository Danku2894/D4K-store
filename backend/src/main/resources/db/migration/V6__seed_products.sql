-- Seed sample products
-- Migration V6: Insert sample products for fashion e-commerce

-- Men's Shirts
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active, created_at, updated_at)
SELECT 
    name, 
    description, 
    price,
    stock,
    image_url,
    (SELECT id FROM categories WHERE name = 'Men''s Shirts'),
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Classic White Dress Shirt', 'Elegant white dress shirt for formal occasions', 39.99, 50, 'https://via.placeholder.com/300x400?text=White+Shirt'),
    ('Navy Blue Oxford Shirt', 'Casual oxford shirt in navy blue', 34.99, 75, 'https://via.placeholder.com/300x400?text=Oxford+Shirt'),
    ('Checkered Cotton Shirt', 'Comfortable cotton shirt with checkered pattern', 29.99, 100, 'https://via.placeholder.com/300x400?text=Checkered+Shirt')
) AS products(name, description, price, stock, image_url);

-- Men's Pants
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active, created_at, updated_at)
SELECT 
    name, 
    description, 
    price,
    stock,
    image_url,
    (SELECT id FROM categories WHERE name = 'Men''s Pants'),
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Slim Fit Jeans', 'Modern slim fit jeans in dark blue', 49.99, 60, 'https://via.placeholder.com/300x400?text=Slim+Jeans'),
    ('Khaki Chinos', 'Versatile khaki chinos for casual wear', 44.99, 80, 'https://via.placeholder.com/300x400?text=Chinos'),
    ('Black Dress Pants', 'Formal black dress pants', 54.99, 40, 'https://via.placeholder.com/300x400?text=Dress+Pants')
) AS products(name, description, price, stock, image_url);

-- Women's Dresses
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active, created_at, updated_at)
SELECT 
    name, 
    description, 
    price,
    stock,
    image_url,
    (SELECT id FROM categories WHERE name = 'Women''s Dresses'),
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Floral Summer Dress', 'Light and breezy summer dress with floral print', 59.99, 45, 'https://via.placeholder.com/300x400?text=Summer+Dress'),
    ('Elegant Evening Gown', 'Sophisticated evening gown for special occasions', 129.99, 20, 'https://via.placeholder.com/300x400?text=Evening+Gown'),
    ('Casual Midi Dress', 'Comfortable midi dress for everyday wear', 49.99, 65, 'https://via.placeholder.com/300x400?text=Midi+Dress')
) AS products(name, description, price, stock, image_url);

-- Women's Tops
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active, created_at, updated_at)
SELECT 
    name, 
    description, 
    price,
    stock,
    image_url,
    (SELECT id FROM categories WHERE name = 'Women''s Tops'),
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Silk Blouse', 'Elegant silk blouse in cream color', 69.99, 35, 'https://via.placeholder.com/300x400?text=Silk+Blouse'),
    ('Cotton T-Shirt', 'Basic cotton t-shirt in multiple colors', 19.99, 150, 'https://via.placeholder.com/300x400?text=T-Shirt'),
    ('Striped Long Sleeve Top', 'Casual striped top with long sleeves', 34.99, 90, 'https://via.placeholder.com/300x400?text=Striped+Top')
) AS products(name, description, price, stock, image_url);

-- Accessories - Bags
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active, created_at, updated_at)
SELECT 
    name, 
    description, 
    price,
    stock,
    image_url,
    (SELECT id FROM categories WHERE name = 'Bags'),
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    ('Leather Handbag', 'Premium leather handbag in brown', 89.99, 30, 'https://via.placeholder.com/300x400?text=Handbag'),
    ('Canvas Backpack', 'Durable canvas backpack for daily use', 44.99, 70, 'https://via.placeholder.com/300x400?text=Backpack'),
    ('Minimalist Wallet', 'Sleek minimalist wallet with RFID protection', 24.99, 120, 'https://via.placeholder.com/300x400?text=Wallet')
) AS products(name, description, price, stock, image_url);

-- Out of stock product example
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active, created_at, updated_at)
VALUES (
    'Limited Edition Sneakers',
    'Exclusive limited edition sneakers - currently out of stock',
    149.99,
    0,
    'https://via.placeholder.com/300x400?text=Sneakers',
    (SELECT id FROM categories WHERE name = 'Men''s Shoes'),
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Inactive product example (hidden from public)
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active, created_at, updated_at)
VALUES (
    'Discontinued Winter Jacket',
    'Winter jacket - discontinued item',
    79.99,
    5,
    'https://via.placeholder.com/300x400?text=Winter+Jacket',
    (SELECT id FROM categories WHERE name = 'Men''s Jackets'),
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

COMMENT ON TABLE products IS 'Sample fashion products seeded for demo';

