const { S3Client, CreateBucketCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin123',
  },
  forcePathStyle: true,
});

async function setupMinIO() {
  try {
    console.log('🚀 Setting up MinIO bucket...');

    // Create bucket
    const createBucketCommand = new CreateBucketCommand({
      Bucket: 'ecommerce-storage',
    });

    await s3Client.send(createBucketCommand);
    console.log('✅ Bucket "ecommerce-storage" created successfully');

    // Set bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: 'arn:aws:s3:::ecommerce-storage/*',
        },
      ],
    };

    const putPolicyCommand = new PutBucketPolicyCommand({
      Bucket: 'ecommerce-storage',
      Policy: JSON.stringify(bucketPolicy),
    });

    await s3Client.send(putPolicyCommand);
    console.log('✅ Bucket policy set for public read access');

    console.log('🎉 MinIO setup completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Start your application: pnpm start:dev');
    console.log('2. Test file upload: POST /storage/upload');
    console.log('3. Check MinIO console: http://localhost:9001');
    console.log('   Username: minioadmin');
    console.log('   Password: minioadmin123');

  } catch (error) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log('✅ Bucket already exists');
    } else {
      console.error('❌ Error setting up MinIO:', error.message);
    }
  }
}

setupMinIO();
