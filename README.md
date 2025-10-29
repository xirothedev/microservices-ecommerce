# Microservices E-commerce - User & Auth Modules

This project implements complete user management and authentication modules for a microservices e-commerce application using NestJS and Prisma.

## Features

### User Module
- Complete CRUD operations for users
- Password hashing with argon2
- Soft delete functionality
- Email and username uniqueness validation
- Both REST API and microservice message patterns

### Authentication Module
- JWT-based authentication
- User registration and login
- Password validation
- Protected routes with guards
- Both REST API and microservice message patterns

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/microservices_ecommerce?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# App
PORT=3000
```

### 3. Database Setup
```bash
# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# (Optional) Open Prisma Studio to view data
pnpm prisma:studio
```

### 4. Start the Application
```bash
# Development mode
pnpm start:dev

# Production mode
pnpm start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (protected)

### Users
- `POST /users` - Create a new user
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

## Microservice Message Patterns

### Authentication
- `auth_validate_user` - Validate user credentials
- `auth_login` - Login user
- `auth_register` - Register user
- `auth_get_profile` - Get user profile

### Users
- `get_user` - Get user by ID
- `get_user_by_email` - Get user by email
- `get_user_by_username` - Get user by username
- `create_user` - Create user
- `update_user` - Update user
- `delete_user` - Delete user
- `validate_user_password` - Validate password

## Database Schema

The User model includes:
- `id` - Unique identifier (CUID)
- `email` - Email address (unique)
- `username` - Username (unique)
- `password` - Hashed password
- `firstName` - Optional first name
- `lastName` - Optional last name
- `avatar` - Optional avatar URL
- `isActive` - Active status (for soft delete)
- `role` - User role (USER, ADMIN, MODERATOR)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Security Features

- Password hashing with argon2
- JWT token authentication
- Input validation with class-validator
- CORS enabled
- Protected routes with guards
- Soft delete for data integrity

## Development

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Code Formatting
```bash
pnpm format
```

### Linting
```bash
pnpm lint
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Authentication guards
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── dto/             # Data Transfer Objects
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── prisma/              # Prisma configuration
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts        # Main application module
└── main.ts             # Application entry point
```

## Example Usage

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login user
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get user profile (requires JWT token)
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```