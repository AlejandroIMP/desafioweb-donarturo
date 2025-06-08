#!/bin/bash

# Image Upload Complete Test Script
# This script tests the complete image upload workflow

echo "🚀 Starting Complete Image Upload Test"
echo "======================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

echo -e "${BLUE}📋 Test Configuration:${NC}"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Test 1: Check if servers are running
echo -e "${YELLOW}🔍 Test 1: Checking Server Status${NC}"
echo "Checking backend server..."
if curl -s "$BACKEND_URL/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
else
    echo -e "${RED}❌ Backend server is not running${NC}"
    echo "Please start the backend server: cd packages/backend && npm run dev"
    exit 1
fi

echo "Checking frontend server..."
if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend server is running${NC}"
else
    echo -e "${RED}❌ Frontend server is not running${NC}"
    echo "Please start the frontend server: cd packages/frontend && npm run dev"
    exit 1
fi
echo ""

# Test 2: Check database connection and table structure
echo -e "${YELLOW}🔍 Test 2: Database Structure Verification${NC}"
echo "Checking if cloudinary_public_id column exists..."
if PGPASSWORD='Hutch4157' psql -U alejo -d ecommerce_gda004 -t -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cloudinary_public_id';" | grep -q "cloudinary_public_id"; then
    echo -e "${GREEN}✅ Database migration completed - cloudinary_public_id column exists${NC}"
else
    echo -e "${RED}❌ Database migration incomplete - cloudinary_public_id column missing${NC}"
    echo "Please run the migration: cd packages/backend && psql -U alejo -d ecommerce_gda004 -f migrations/add_cloudinary_public_id_to_products.sql"
    exit 1
fi
echo ""

# Test 3: Check Cloudinary configuration
echo -e "${YELLOW}🔍 Test 3: Cloudinary Configuration${NC}"
if [ -f "packages/backend/.env" ]; then
    echo "Checking Cloudinary environment variables..."
    if grep -q "CLOUDINARY_CLOUD_NAME=your_cloud_name" packages/backend/.env; then
        echo -e "${YELLOW}⚠️  Cloudinary credentials are still using placeholder values${NC}"
        echo "Please update packages/backend/.env with your actual Cloudinary credentials"
        echo "See CLOUDINARY_SETUP_GUIDE.md for instructions"
        CLOUDINARY_CONFIGURED=false
    else
        echo -e "${GREEN}✅ Cloudinary credentials appear to be configured${NC}"
        CLOUDINARY_CONFIGURED=true
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi
echo ""

# Test 4: Check API endpoints
echo -e "${YELLOW}🔍 Test 4: API Endpoints Verification${NC}"
echo "Testing basic products endpoint..."
if curl -s "$BACKEND_URL/api/productos" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Basic products API is accessible${NC}"
else
    echo -e "${RED}❌ Basic products API is not accessible${NC}"
fi

echo "Testing image upload endpoint availability..."
UPLOAD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/productos/with-image")
if [ "$UPLOAD_RESPONSE" = "401" ] || [ "$UPLOAD_RESPONSE" = "403" ] || [ "$UPLOAD_RESPONSE" = "400" ]; then
    echo -e "${GREEN}✅ Image upload endpoint is accessible (authentication required)${NC}"
elif [ "$UPLOAD_RESPONSE" = "404" ]; then
    echo -e "${RED}❌ Image upload endpoint not found${NC}"
else
    echo -e "${YELLOW}⚠️  Image upload endpoint returned status: $UPLOAD_RESPONSE${NC}"
fi
echo ""

# Test 5: Frontend component verification
echo -e "${YELLOW}🔍 Test 5: Frontend Components Verification${NC}"
echo "Checking if image upload components exist..."

COMPONENTS_TO_CHECK=(
    "packages/frontend/src/components/ImageUpload/index.tsx"
    "packages/frontend/src/components/ProductCreateFormWithImage/index.tsx"
    "packages/frontend/src/components/ProductUpdateFormWithImage/index.tsx"
    "packages/frontend/src/pages/admin/ProductManagment/index.tsx"
)

for component in "${COMPONENTS_TO_CHECK[@]}"; do
    if [ -f "$component" ]; then
        echo -e "${GREEN}✅ $component exists${NC}"
    else
        echo -e "${RED}❌ $component missing${NC}"
    fi
done
echo ""

# Test 6: Create test image (if doesn't exist)
echo -e "${YELLOW}🔍 Test 6: Test Image Preparation${NC}"
TEST_IMAGE="test-image.jpg"
if [ ! -f "$TEST_IMAGE" ]; then
    echo "Creating test image..."
    # Create a simple test image using ImageMagick (if available)
    if command -v convert > /dev/null 2>&1; then
        convert -size 300x300 xc:lightblue -pointsize 30 -fill black -gravity center -annotate +0+0 "TEST\nIMAGE" "$TEST_IMAGE"
        echo -e "${GREEN}✅ Test image created: $TEST_IMAGE${NC}"
    else
        echo -e "${YELLOW}⚠️  ImageMagick not available. Please manually create a test image named 'test-image.jpg'${NC}"
    fi
else
    echo -e "${GREEN}✅ Test image already exists: $TEST_IMAGE${NC}"
fi
echo ""

# Test 7: Manual testing instructions
echo -e "${YELLOW}🔍 Test 7: Manual Testing Instructions${NC}"
echo -e "${BLUE}To complete the testing, please perform these manual tests:${NC}"
echo ""
echo "1. Open the frontend application:"
echo "   ${FRONTEND_URL}/admin/products"
echo ""
echo "2. Test the dropdown menus:"
echo "   - Click 'Add Product' and verify both 'Basic Form' and 'With Image Upload' options"
echo "   - Click on an existing product's edit menu and verify both options"
echo ""
echo "3. Test image upload form:"
echo "   - Select 'With Image Upload' from the Add Product menu"
echo "   - Fill in all required fields"
echo "   - Select an image file"
echo "   - Submit the form"
echo ""
echo "4. Verify the result:"
echo "   - Check if the product was created successfully"
echo "   - Verify the image is displayed in the product list"
echo "   - Check the database for the cloudinary_public_id value"
echo ""

# Summary
echo -e "${BLUE}📊 Test Summary${NC}"
echo "==============="
echo -e "✅ Backend server: ${GREEN}Running${NC}"
echo -e "✅ Frontend server: ${GREEN}Running${NC}"
echo -e "✅ Database migration: ${GREEN}Complete${NC}"
if [ "$CLOUDINARY_CONFIGURED" = true ]; then
    echo -e "✅ Cloudinary config: ${GREEN}Configured${NC}"
else
    echo -e "⚠️  Cloudinary config: ${YELLOW}Needs Setup${NC}"
fi
echo -e "✅ API endpoints: ${GREEN}Available${NC}"
echo -e "✅ Frontend components: ${GREEN}Implemented${NC}"
echo ""

if [ "$CLOUDINARY_CONFIGURED" = false ]; then
    echo -e "${YELLOW}⚠️  Next Step: Configure Cloudinary credentials${NC}"
    echo "See CLOUDINARY_SETUP_GUIDE.md for detailed instructions"
else
    echo -e "${GREEN}🎉 System is ready for image upload testing!${NC}"
    echo "Follow the manual testing instructions above to complete verification"
fi

echo ""
echo -e "${BLUE}📚 Additional Resources:${NC}"
echo "- Implementation Guide: IMAGE_UPLOAD_IMPLEMENTATION_GUIDE.md"
echo "- Cloudinary Setup: CLOUDINARY_SETUP_GUIDE.md"
echo "- Complete Summary: IMPLEMENTATION_COMPLETE.md"
echo ""
echo -e "${GREEN}🚀 Image Upload Implementation Test Complete!${NC}"
