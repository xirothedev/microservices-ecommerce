const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

async function testS3Integration() {
  console.log('🧪 Testing S3 Integration with MinIO...\n');

  try {
    // 1. Test health check
    console.log('1️⃣ Testing storage health check...');
    const healthResponse = await axios.get(`${BASE_URL}/storage/health`);
    console.log('✅ Health check:', healthResponse.data);

    // 2. Register a user first
    console.log('\n2️⃣ Registering user for testing...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    const token = registerResponse.data.accessToken;
    console.log('✅ User registered, token received');

    // 3. Test file upload
    console.log('\n3️⃣ Testing file upload...');
    
    // Create a test file
    const testContent = 'This is a test file for S3 integration';
    const testFileName = 'test-file.txt';
    fs.writeFileSync(testFileName, testContent);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFileName), {
      filename: testFileName,
      contentType: 'text/plain'
    });
    formData.append('prefix', 'test-uploads');

    const uploadResponse = await axios.post(`${BASE_URL}/storage/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ File uploaded:', uploadResponse.data);
    const fileKey = uploadResponse.data.data.key;

    // 4. Test file download
    console.log('\n4️⃣ Testing file download...');
    const downloadResponse = await axios.get(`${BASE_URL}/storage/file/${fileKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ File downloaded, content:', downloadResponse.data.toString());

    // 5. Test file info
    console.log('\n5️⃣ Testing file info...');
    const infoResponse = await axios.get(`${BASE_URL}/storage/file-info/${fileKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ File info:', infoResponse.data);

    // 6. Test presigned URL
    console.log('\n6️⃣ Testing presigned URL...');
    const presignedResponse = await axios.get(`${BASE_URL}/storage/presigned-url/${fileKey}?expiresIn=3600`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Presigned URL generated:', presignedResponse.data.data.url);

    // 7. Test avatar upload
    console.log('\n7️⃣ Testing avatar upload...');
    
    // Create a test image (simple text file as image)
    const avatarContent = 'fake-image-content';
    const avatarFileName = 'avatar.jpg';
    fs.writeFileSync(avatarFileName, avatarContent);

    const avatarFormData = new FormData();
    avatarFormData.append('avatar', fs.createReadStream(avatarFileName), {
      filename: avatarFileName,
      contentType: 'image/jpeg'
    });
    avatarFormData.append('userId', registerResponse.data.user.id);

    const avatarResponse = await axios.post(`${BASE_URL}/storage/upload-avatar`, avatarFormData, {
      headers: {
        ...avatarFormData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Avatar uploaded:', avatarResponse.data);

    // 8. Test user avatar update
    console.log('\n8️⃣ Testing user avatar update...');
    const updateAvatarResponse = await axios.patch(`${BASE_URL}/users/${registerResponse.data.user.id}/avatar`, {
      avatarUrl: avatarResponse.data.data.url
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ User avatar updated:', updateAvatarResponse.data);

    // 9. Test file deletion
    console.log('\n9️⃣ Testing file deletion...');
    const deleteResponse = await axios.delete(`${BASE_URL}/storage/file/${fileKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ File deleted:', deleteResponse.data);

    // Cleanup
    fs.unlinkSync(testFileName);
    fs.unlinkSync(avatarFileName);

    console.log('\n🎉 All S3 integration tests passed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Health check');
    console.log('   ✅ File upload');
    console.log('   ✅ File download');
    console.log('   ✅ File info');
    console.log('   ✅ Presigned URL');
    console.log('   ✅ Avatar upload');
    console.log('   ✅ User avatar update');
    console.log('   ✅ File deletion');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the application is running:');
      console.log('   pnpm start:dev');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure MinIO is running:');
      console.log('   docker-compose up -d');
      console.log('   node setup-minio.js');
    }
  }
}

// Run the test
testS3Integration();
