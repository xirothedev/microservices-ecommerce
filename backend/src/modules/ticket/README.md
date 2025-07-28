# Ticket WebSocket Authentication

This module implements secure WebSocket authentication for the ticket system using JWT tokens.

## Features

- **JWT Token Authentication**: Validates JWT tokens from multiple sources
- **User Verification**: Ensures only verified users can connect
- **Ban Protection**: Prevents banned users from connecting
- **Multiple Token Sources**: Supports cookies, headers, query params, and Socket.IO auth
- **Comprehensive Logging**: Detailed logs for debugging and monitoring
- **Type Safety**: Full TypeScript support with proper typing

## Components

### WsAuthGuard

The main authentication guard that validates WebSocket connections.

**Location**: `guards/ws-auth.guard.ts`

**Features**:

- Extracts JWT tokens from multiple sources
- Validates token authenticity
- Checks user verification status
- Prevents banned users from connecting
- Attaches user data to socket for later use

### WsUser Decorator

Decorator to extract the authenticated user from WebSocket context.

**Location**: `decorators/ws-user.decorator.ts`

**Usage**:

```typescript
@SubscribeMessage('some.event')
handleEvent(@WsUser() user: User) {
  // user is the authenticated User object
}
```

## Token Sources

The guard supports JWT tokens from the following sources (in order of priority):

1. **Cookies**: `access_token` cookie (most common for web clients)
2. **Authorization Header**: `Bearer <token>` format
3. **Query Parameters**: `?token=<jwt_token>` (useful for testing)
4. **Socket.IO Auth**: `socket.auth.token` (Socket.IO specific)

## Usage

### Basic Setup

```typescript
@WebSocketGateway({ namespace: 'ticket', transports: ['websocket'] })
@UseGuards(WsAuthGuard)
export class TicketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Your gateway implementation
}
```

### Message Handlers

```typescript
@SubscribeMessage('join.ticket.room')
async handleJoinTicketRoom(
  @MessageBody() ticketId: string,
  @ConnectedSocket() client: Socket,
  @WsUser() user: User,
) {
  // user is automatically available and typed
  console.log(`User ${user.email} joined ticket room ${ticketId}`);
}
```

### Client Connection

#### Web Client (with cookies)

```javascript
const socket = io('http://localhost:3000/ticket', {
  withCredentials: true, // Important for cookies
});
```

#### Mobile/API Client (with token)

```javascript
const socket = io('http://localhost:3000/ticket', {
  auth: {
    token: 'your-jwt-token',
  },
});
```

#### Query Parameter (for testing)

```javascript
const socket = io('http://localhost:3000/ticket?token=your-jwt-token');
```

## Security Features

- **Token Validation**: Verifies JWT signature and expiration
- **User Status Checks**: Ensures user is verified and not banned
- **Comprehensive Logging**: Tracks authentication attempts and failures
- **Error Handling**: Proper error responses for unauthorized access
- **Type Safety**: Prevents runtime errors with proper TypeScript types

## Error Handling

The guard throws `WsException` with appropriate messages:

- `'Access token not found'` - No token provided
- `'User needs to be verified'` - User account not verified
- `'User has been banned'` - User account is banned
- `'Unauthorized'` - General authentication failure

## Logging

The guard provides detailed logging:

- **Info**: Successful authentications
- **Warn**: Failed authentication attempts
- **Error**: Authentication errors
- **Debug**: Token extraction details

## Dependencies

- `@nestjs/jwt` - JWT token validation
- `@nestjs/config` - Configuration management
- `@prisma/client` - Database access
- `socket.io` - WebSocket functionality

## Configuration

Ensure the following environment variables are set:

```env
ACCESS_TOKEN_SECRET_KEY=your-jwt-secret-key
```

## Testing

To test the authentication:

1. **Valid Token**: Should connect successfully
2. **Invalid Token**: Should be rejected with "Unauthorized"
3. **No Token**: Should be rejected with "Access token not found"
4. **Expired Token**: Should be rejected with "Unauthorized"
5. **Unverified User**: Should be rejected with "User needs to be verified"
6. **Banned User**: Should be rejected with "User has been banned"
