#!/bin/bash

echo "🚀 Starting Microservices E-commerce with MinIO..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Docker services
echo "📦 Starting Docker services (MinIO, PostgreSQL, Kafka)..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if MinIO is ready
echo "🔍 Checking MinIO health..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1; then
        echo "✅ MinIO is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ MinIO failed to start after $max_attempts attempts"
        exit 1
    fi
    
    echo "⏳ Waiting for MinIO... (attempt $attempt/$max_attempts)"
    sleep 2
    attempt=$((attempt + 1))
done

# Setup MinIO bucket
echo "🪣 Setting up MinIO bucket..."
node setup-minio.js

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm prisma:generate

# Run database migrations
echo "🗄️ Running database migrations..."
pnpm prisma:migrate

echo "🎉 All services are ready!"
echo ""
echo "📋 Service URLs:"
echo "   - API Server: http://localhost:3000"
echo "   - MinIO Console: http://localhost:9001"
echo "   - PostgreSQL: localhost:5432"
echo "   - Kafka: localhost:9092"
echo ""
echo "🔑 MinIO Credentials:"
echo "   - Username: minioadmin"
echo "   - Password: minioadmin123"
echo ""
echo "🚀 Starting application..."
pnpm start:dev
