-- Migration: Add cloudinary_public_id column to products table
-- Date: 2025-01-02
-- Purpose: Support for image upload functionality with Cloudinary

BEGIN;

-- Add cloudinary_public_id column to products table
ALTER TABLE products 
ADD COLUMN cloudinary_public_id VARCHAR(200) NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN products.cloudinary_public_id IS 'Cloudinary public ID for the product image, used for image management and deletion';

-- Add index for performance on cloudinary_public_id lookups
CREATE INDEX IF NOT EXISTS idx_products_cloudinary_public_id 
ON products(cloudinary_public_id) 
WHERE cloudinary_public_id IS NOT NULL;

COMMIT;
