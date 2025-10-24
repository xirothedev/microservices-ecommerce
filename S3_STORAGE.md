# S3 Storage Integration với MinIO

## Tổng quan

Project đã được tích hợp với **MinIO** để giả lập **Amazon S3** cho việc lưu trữ files. MinIO cung cấp S3-compatible API và có thể được sử dụng để phát triển và test locally.

## Kiến trúc

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   NestJS API    │    │     MinIO       │
│                 │    │                 │    │   (S3 Storage)  │
│  File Upload    │───▶│  Storage Module │───▶│                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Services được cài đặt

### 1. MinIO Server
- **Port**: 9000 (API), 9001 (Console)
- **Credentials**: minioadmin / minioadmin123
- **Bucket**: ecommerce-storage

### 2. PostgreSQL Database
- **Port**: 5432
- **Database**: microservices_ecommerce
- **Credentials**: postgres / postgres123

### 3. Kafka Message Broker
- **Port**: 9092
- **Zookeeper**: 2181

## Cài đặt và chạy

### 1. Start tất cả services
```bash
./start-services.sh
```

### 2. Manual setup
```bash
# Start Docker services
docker-compose up -d

# Setup MinIO bucket
node setup-minio.js

# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Start application
pnpm start:dev
```

## API Endpoints

### File Upload
```bash
# Upload file
POST /storage/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form data:
- file: <file>
- prefix: "uploads" (optional)
```

### Avatar Upload
```bash
# Upload user avatar
POST /storage/upload-avatar
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form data:
- avatar: <image-file>
- userId: "user-id"
```

### File Management
```bash
# Get file
GET /storage/file/:key
Authorization: Bearer <token>

# Get presigned URL
GET /storage/presigned-url/:key?expiresIn=3600&operation=getObject
Authorization: Bearer <token>

# Get file info
GET /storage/file-info/:key
Authorization: Bearer <token>

# Delete file
DELETE /storage/file/:key
Authorization: Bearer <token>

# Health check
GET /storage/health
```

### User Avatar Management
```bash
# Update user avatar URL
PATCH /users/:id/avatar
Authorization: Bearer <token>
Content-Type: application/json

{
  "avatarUrl": "http://localhost:9000/ecommerce-storage/avatars/user123/image.jpg"
}

# Delete user avatar
DELETE /users/:id/avatar
Authorization: Bearer <token>
```

## S3Service Methods

### Upload Methods
```typescript
// Upload from Multer file
await s3Service.uploadFile(key, file, contentType);

// Upload from buffer
await s3Service.uploadFromBuffer(key, buffer, contentType, metadata);

// Generate unique file key
const key = s3Service.generateFileKey('avatars/user123', 'image.jpg');
// Result: avatars/user123/1234567890-abc123.jpg
```

### File Operations
```typescript
// Get file
const fileBuffer = await s3Service.getFile(key);

// Delete file
await s3Service.deleteFile(key);

// Check if file exists
const exists = await s3Service.fileExists(key);

// Get file info
const info = await s3Service.getFileInfo(key);
```

### Presigned URLs
```typescript
// Generate presigned URL for download
const downloadUrl = await s3Service.generatePresignedUrl(key, 3600, 'getObject');

// Generate presigned URL for upload
const uploadUrl = await s3Service.generatePresignedUrl(key, 3600, 'putObject');
```

## Configuration

### Environment Variables
```env
# S3/MinIO Configuration
S3_ENDPOINT="http://localhost:9000"
S3_REGION="us-east-1"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin123"
S3_BUCKET_NAME="ecommerce-storage"
```

### S3Service Configuration
```typescript
const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin123',
  },
  forcePathStyle: true, // Required for MinIO
});
```

## File Structure

```
src/storage/
├── s3.service.ts          # S3 operations service
├── storage.controller.ts   # File upload/download endpoints
└── storage.module.ts       # Storage module configuration
```

## Security Features

### 1. File Type Validation
- Only allowed image types for avatars
- Configurable MIME type validation

### 2. File Size Limits
- 5MB maximum for avatars
- Configurable size limits

### 3. Authentication
- All endpoints require JWT authentication
- User-specific file access

### 4. File Naming
- Unique file keys with timestamps
- Organized folder structure

## Testing

### 1. Test File Upload
```bash
curl -X POST http://localhost:3000/storage/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@test-image.jpg" \
  -F "prefix=test"
```

### 2. Test Avatar Upload
```bash
curl -X POST http://localhost:3000/storage/upload-avatar \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@avatar.jpg" \
  -F "userId=user123"
```

### 3. Test File Download
```bash
curl -X GET http://localhost:3000/storage/file/avatars/user123/image.jpg \
  -H "Authorization: Bearer <token>"
```

## MinIO Console

Truy cập MinIO Console tại: http://localhost:9001

- **Username**: minioadmin
- **Password**: minioadmin123

Tại đây bạn có thể:
- Xem các buckets và files
- Quản lý permissions
- Monitor storage usage
- Test file operations

## Production Deployment

### 1. Environment Variables
```env
S3_ENDPOINT="https://your-minio-domain.com"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_BUCKET_NAME="production-storage"
```

### 2. SSL Configuration
```typescript
const s3Client = new S3Client({
  endpoint: 'https://your-minio-domain.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});
```

### 3. CORS Configuration
```typescript
app.enableCors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true,
});
```

## Troubleshooting

### 1. MinIO Connection Issues
```bash
# Check if MinIO is running
curl http://localhost:9000/minio/health/live

# Check Docker logs
docker logs minio
```

### 2. File Upload Issues
- Check file size limits
- Verify MIME type validation
- Ensure JWT token is valid

### 3. Database Issues
```bash
# Check PostgreSQL connection
docker logs postgres

# Reset database
pnpm prisma:migrate reset
```

## Performance Optimization

### 1. File Compression
```typescript
// Compress images before upload
const compressedImage = await sharp(file.buffer)
  .resize(800, 600)
  .jpeg({ quality: 80 })
  .toBuffer();
```

### 2. CDN Integration
```typescript
// Use CDN URL for file access
const cdnUrl = `https://cdn.yourdomain.com/${key}`;
```

### 3. Caching
```typescript
// Cache file metadata
@Cacheable('file-info', 300) // 5 minutes
async getFileInfo(key: string) {
  // ...
}
```

## Monitoring

### 1. Health Checks
```bash
# Check storage health
curl http://localhost:3000/storage/health
```

### 2. Metrics
- File upload/download counts
- Storage usage
- Error rates
- Response times

## Kết luận

MinIO integration cung cấp:
- ✅ **S3-compatible API** cho development và production
- ✅ **File upload/download** với authentication
- ✅ **Presigned URLs** cho secure access
- ✅ **Avatar management** cho users
- ✅ **Docker setup** cho easy development
- ✅ **Security features** và validation

Hệ thống storage đã sẵn sàng cho production với khả năng scale và bảo mật cao! 🚀
