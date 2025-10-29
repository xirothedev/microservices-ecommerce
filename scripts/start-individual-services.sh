#!/bin/bash

# Script to start individual microservices
# Usage: ./scripts/start-individual-services.sh [service-name]

SERVICE=$1

case $SERVICE in
  "infrastructure")
    echo "🚀 Starting infrastructure services..."
    docker-compose up -d
    echo "✅ Infrastructure services started!"
    echo "📋 Services:"
    echo "   - MinIO: http://localhost:9001"
    echo "   - PostgreSQL: localhost:5430"
    echo "   - Kafka: localhost:9092"
    ;;
  "auth")
    echo "🔐 Starting Auth Service..."
    pnpm start:dev auth-service
    ;;
  "products")
    echo "📦 Starting Products Service..."
    pnpm start:dev products-service
    ;;
  "gateway")
    echo "🌐 Starting API Gateway..."
    pnpm start:dev api-gateway
    ;;
  "all")
    echo "🚀 Starting all microservices..."
    pnpm start:dev
    ;;
  *)
    echo "❌ Unknown service: $SERVICE"
    echo ""
    echo "Available services:"
    echo "  - infrastructure: Start Docker services (MinIO, PostgreSQL, Kafka)"
    echo "  - auth: Start Auth Service"
    echo "  - products: Start Products Service"
    echo "  - gateway: Start API Gateway"
    echo "  - all: Start all microservices at once"
    echo ""
    echo "Usage: ./scripts/start-individual-services.sh [service-name]"
    ;;
esac
