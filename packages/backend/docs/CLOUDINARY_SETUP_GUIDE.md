# Cloudinary Setup Guide

## Overview
This guide will help you configure Cloudinary for the image upload functionality in your e-commerce application.

## Steps to Configure Cloudinary

### 1. Create a Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Cloudinary Credentials
1. Log in to your Cloudinary dashboard
2. In the dashboard, you'll see your account details:
   - **Cloud Name**: Your unique cloud name
   - **API Key**: Your API key
   - **API Secret**: Your API secret (click the eye icon to reveal)

### 3. Update Environment Variables
Replace the placeholder values in `/packages/backend/.env` with your actual Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 4. Restart the Backend Server
After updating the environment variables, restart your backend server:

```bash
cd packages/backend
npm run dev
```

## Testing the Configuration

### 1. Test Cloudinary Connection
Run this command to test if Cloudinary is properly configured:

```bash
cd packages/backend
npm run test:cloudinary
```

### 2. Test Image Upload Endpoint
Use curl to test the image upload endpoint:

```bash
curl -X POST http://localhost:5000/api/products/with-image \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/test-image.jpg" \
  -F "productName=Test Product" \
  -F "price=99.99" \
  -F "stock=10" \
  -F "categoryId=1" \
  -F "description=Test product with image"
```

### 3. Test Frontend Image Upload
1. Navigate to the admin panel: http://localhost:5173/admin/products
2. Click "Add Product" → "With Image Upload"
3. Fill in the form and select an image
4. Submit the form and verify the product is created with the image

## Cloudinary Configuration Options

### Image Upload Settings
The current configuration includes:
- **Folder**: `ecommerce/products` - All product images are organized in this folder
- **Format**: Auto-optimization for web delivery
- **Quality**: Auto-optimization for best performance
- **Transformation**: Automatic resizing and format conversion

### Security Settings
- **Upload Presets**: Consider creating upload presets in Cloudinary for additional security
- **Allowed Formats**: Currently allows common image formats (jpg, png, gif, webp)
- **File Size**: Limited to 10MB per upload

## Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Verify your API key is correct
   - Ensure no extra spaces in the .env file
   - Restart the backend server after changes

2. **"Upload Failed" Error**
   - Check your internet connection
   - Verify Cloudinary account is active
   - Check if you've exceeded free tier limits

3. **"Image Not Displaying" Error**
   - Verify the cloudinary_public_id is saved in the database
   - Check the image URL generation in the frontend
   - Ensure Cloudinary delivery URLs are accessible

### Checking Cloudinary Dashboard
1. Log in to your Cloudinary dashboard
2. Go to "Media Library" to see uploaded images
3. Check "Usage" to monitor your current usage
4. Review "Settings" → "Security" for security configurations

## Production Considerations

### Security
- Use environment-specific configurations
- Consider using Cloudinary's upload presets
- Implement proper authentication and authorization
- Set up proper CORS policies

### Performance
- Configure appropriate image transformations
- Use Cloudinary's CDN for optimal delivery
- Implement lazy loading for images
- Consider using responsive images

### Monitoring
- Set up usage alerts in Cloudinary
- Monitor API usage and quotas
- Implement error logging and monitoring
- Regular backup of image metadata

## Next Steps
1. Configure Cloudinary credentials
2. Test the complete image upload workflow
3. Deploy to production with environment-specific settings
4. Monitor usage and performance
