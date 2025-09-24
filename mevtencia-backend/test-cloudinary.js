const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dw8qh8mjq',
  api_key: process.env.CLOUDINARY_API_KEY || '729489548369364',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'jKR98Ma0nDr747_WxDCq4fDr890'
});

console.log('Cloudinary config:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key
});

// Test Cloudinary connection
async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
  } catch (error) {
    console.error('Cloudinary connection error:', error);
  }
}

testCloudinary();