const cloudinary = require('../config/cloudinary');

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test with a simple upload of a small text buffer
    const testResult = await cloudinary.uploader.upload(
      'data:text/plain;base64,SGVsbG8gV29ybGQ=', // "Hello World" in base64
      {
        resource_type: 'raw',
        public_id: 'test_connection_' + Date.now(),
        overwrite: true
      }
    );

    console.log('✅ Cloudinary connection successful!');
    console.log('Test upload result:', {
      public_id: testResult.public_id,
      resource_type: testResult.resource_type,
      created_at: testResult.created_at
    });

    // Clean up test file
    try {
      await cloudinary.uploader.destroy(testResult.public_id, { resource_type: 'raw' });
      console.log('Test file cleaned up');
    } catch (cleanupError) {
      console.log('Note: Test file cleanup failed (this is normal)');
    }

    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    console.error('Error details:', {
      http_code: error.http_code,
      message: error.message
    });
    
    // Check specific error types
    if (error.http_code === 401) {
      console.error('❌ Authentication failed. Please check your Cloudinary credentials.');
    } else if (error.http_code === 403) {
      console.error('❌ Access forbidden. Please check your Cloudinary permissions.');
    } else if (error.message.includes('Invalid cloud_name')) {
      console.error('❌ Invalid cloud name. Please check CLOUDINARY_NAME in .env');
    }
    
    return false;
  }
};

module.exports = { testCloudinaryConnection };
