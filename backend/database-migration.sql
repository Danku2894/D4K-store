-- Database Migration for Image Upload Feature

-- Add image_url column to categories table
ALTER TABLE categories ADD COLUMN image_url VARCHAR(500);

-- Verify the column was added
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'categories' AND column_name = 'image_url';
