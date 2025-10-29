#!/bin/bash

# Prisma Manager Script for Microservices
# Usage: ./scripts/prisma-manager.sh [service] [command]

SERVICE=$1
COMMAND=$2

case $SERVICE in
  "auth")
    SCHEMA_PATH="prisma/schemas/auth/schema.prisma"
    ;;
  "products")
    SCHEMA_PATH="prisma/schemas/products/schema.prisma"
    ;;
  "orders")
    SCHEMA_PATH="prisma/schemas/orders/schema.prisma"
    ;;
  "inventory")
    SCHEMA_PATH="prisma/schemas/inventory/schema.prisma"
    ;;
  "payments")
    SCHEMA_PATH="prisma/schemas/payments/schema.prisma"
    ;;
  "notifications")
    SCHEMA_PATH="prisma/schemas/notifications/schema.prisma"
    ;;
  "shared")
    SCHEMA_PATH="prisma/schema.prisma"
    ;;
  "all")
    echo "🔄 Running command for all services..."
    for service in shared auth products orders inventory payments notifications; do
      echo "📦 Processing $service service..."
      ./scripts/prisma-manager.sh $service $COMMAND
    done
    exit 0
    ;;
  *)
    echo "❌ Unknown service: $SERVICE"
    echo ""
    echo "Available services:"
    echo "  - shared: Shared enums and main schema"
    echo "  - auth: Auth Service"
    echo "  - products: Products Service"
    echo "  - orders: Orders Service"
    echo "  - inventory: Inventory Service"
    echo "  - payments: Payments Service"
    echo "  - notifications: Notifications Service"
    echo "  - all: All services"
    echo ""
    echo "Available commands:"
    echo "  - generate: Generate Prisma client"
    echo "  - migrate: Run migrations"
    echo "  - migrate:dev: Create migration"
    echo "  - migrate:reset: Reset database"
    echo "  - db:push: Push schema to database"
    echo "  - db:pull: Pull schema from database"
    echo "  - studio: Open Prisma Studio"
    echo ""
    echo "Usage: ./scripts/prisma-manager.sh [service] [command]"
    exit 1
    ;;
esac

case $COMMAND in
  "generate")
    echo "🔧 Generating Prisma client for $SERVICE service..."
    npx prisma generate --schema=$SCHEMA_PATH
    ;;
  "migrate")
    echo "🗄️ Running migrations for $SERVICE service..."
    npx prisma migrate deploy --schema=$SCHEMA_PATH
    ;;
  "migrate:dev")
    echo "📝 Creating migration for $SERVICE service..."
    npx prisma migrate dev --schema=$SCHEMA_PATH
    ;;
  "migrate:reset")
    echo "🔄 Resetting database for $SERVICE service..."
    npx prisma migrate reset --schema=$SCHEMA_PATH
    ;;
  "db:push")
    echo "⬆️ Pushing schema to database for $SERVICE service..."
    npx prisma db push --schema=$SCHEMA_PATH
    ;;
  "db:pull")
    echo "⬇️ Pulling schema from database for $SERVICE service..."
    npx prisma db pull --schema=$SCHEMA_PATH
    ;;
  "studio")
    echo "🎨 Opening Prisma Studio for $SERVICE service..."
    npx prisma studio --schema=$SCHEMA_PATH
    ;;
  *)
    echo "❌ Unknown command: $COMMAND"
    echo ""
    echo "Available commands:"
    echo "  - generate: Generate Prisma client"
    echo "  - migrate: Run migrations"
    echo "  - migrate:dev: Create migration"
    echo "  - migrate:reset: Reset database"
    echo "  - db:push: Push schema to database"
    echo "  - db:pull: Pull schema from database"
    echo "  - studio: Open Prisma Studio"
    echo ""
    echo "Usage: ./scripts/prisma-manager.sh [service] [command]"
    exit 1
    ;;
esac

echo "✅ Command completed for $SERVICE service"
