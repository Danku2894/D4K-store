-- Drop unique constraint that prevents adding same product with different sizes/colors
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS uk_cart_product;
