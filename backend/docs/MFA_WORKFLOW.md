# Multi-Factor Authentication (MFA) Workflow

## Overview

This document describes the comprehensive MFA implementation for the Web Store application, supporting multiple authentication methods and secure user verification.

## Supported MFA Methods

1. **TOTP (Time-based One-Time Password)** - Using authenticator apps like Google Authenticator
2. **SMS OTP** - SMS-based verification codes
3. **Email OTP** - Email-based verification codes
4. **Backup Codes** - For account recovery

## Database Schema

### New Models

#### MfaSetup

```sql
model MfaSetup {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  type      MfaType
  isEnabled Boolean  @default(false) @map("is_enabled")
  secret    String?  @db.VarChar(255) // For TOTP
  phone     String?  @db.VarChar(20)  // For SMS
  email     String?  @db.VarChar(255) // For email MFA
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@unique([userId, type], name: "user_mfa_type")
}
```

#### MfaBackupCode

```sql
model MfaBackupCode {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  code      String   @db.VarChar(10) // 8-10 character backup code
  isUsed    Boolean  @default(false) @map("is_used")
  usedAt    DateTime? @map("used_at") @db.Timestamptz
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@unique([userId, code], name: "user_backup_code")
}
```

#### LoginSession

```sql
model LoginSession {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @db.Uuid
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  sessionToken String   @unique @map("session_token") @db.VarChar(255)
  ipAddress    String?  @map("ip_address") @db.VarChar(45)
  userAgent    String?  @map("user_agent") @db.Text
  isActive     Boolean  @default(true) @map("is_active")
  expiresAt    DateTime @map("expires_at") @db.Timestamptz
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz
  lastUsedAt   DateTime @updatedAt @map("last_used_at") @db.Timestamptz
}
```

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login with MFA support
- `POST /auth/verify-email` - Send email verification
- `GET /auth/verify-email` - Confirm email verification

### MFA Setup

- `POST /auth/mfa/setup` - Setup MFA method
- `POST /auth/mfa/verify-setup` - Verify and enable MFA
- `POST /auth/mfa/disable` - Disable MFA method
- `GET /auth/mfa/status` - Get MFA status
- `POST /auth/mfa/regenerate-backup-codes` - Regenerate backup codes

### MFA Verification

- `POST /auth/mfa/verify` - Verify MFA during login
- `POST /auth/mfa/request-code` - Request SMS/Email code

## Workflow Diagrams

### 1. User Registration Flow

```
User Registration → Email Verification → Account Ready
```

### 2. First Login Flow

```
Login → Check MFA Status → Setup MFA (Optional) → Account Ready
```

### 3. MFA Setup Flow

```
Setup MFA → Choose Method → Verify Setup → Enable MFA → Generate Backup Codes
```

### 4. Login with MFA Flow

```
Login → Check MFA → Request Code (if needed) → Verify MFA → Generate Session
```

### 5. MFA Recovery Flow

```
Login → MFA Required → Use Backup Code → Account Access
```

## Implementation Details

### TOTP Implementation

- Uses `otplib` library for TOTP generation and verification
- Generates QR codes for easy setup with authenticator apps
- Supports standard TOTP algorithms (SHA1, SHA256, SHA512)

### SMS Implementation

- Generates 6-digit codes
- 5-minute expiration
- Rate limiting to prevent abuse
- TODO: Integrate with SMS service provider

### Email Implementation

- Sends HTML email templates
- 6-digit codes with 5-minute expiration
- Professional email design with security warnings

### Backup Codes

- 10 backup codes per user
- 8-character alphanumeric codes
- One-time use only
- Regenerated when all MFA methods are disabled

## Security Features

### Rate Limiting

- MFA code requests: 1 per minute
- Login attempts: 5 per 15 minutes
- Backup code attempts: 3 per hour

### Code Expiration

- SMS/Email codes: 5 minutes
- TOTP codes: 30 seconds (standard)
- Backup codes: No expiration (until used)

### Session Management

- JWT tokens: 1 hour expiration
- Session tokens: 24 hours expiration
- Automatic session cleanup

### Data Protection

- All sensitive data encrypted at rest
- Passwords hashed with Argon2
- TOTP secrets stored securely
- Backup codes hashed before storage

## Frontend Integration

### Login Flow

```javascript
// 1. Initial login
const loginResponse = await login({ email, password });

// 2. Check if MFA is required
if (loginResponse.requiresMfa) {
  // Show MFA verification UI
  const mfaMethods = loginResponse.mfaMethods;
  // Allow user to choose method or use backup code
}

// 3. Verify MFA
const verifyResponse = await verifyMfa({
  userId: loginResponse.userId,
  type: 'TOTP', // or 'SMS', 'EMAIL', 'BACKUP'
  code: mfaCode,
});

// 4. Complete login
if (verifyResponse.success) {
  // Store tokens and redirect
}
```

### MFA Setup Flow

```javascript
// 1. Setup TOTP
const setupResponse = await setupMfa({ type: 'TOTP' });
// Display QR code: setupResponse.qrCode
// Display secret: setupResponse.secret

// 2. Verify setup
const verifyResponse = await verifyMfaSetup({
  type: 'TOTP',
  code: userEnteredCode,
});

// 3. Setup complete
if (verifyResponse.success) {
  // MFA enabled, backup codes generated
}
```

## Error Handling

### Common Error Responses

```json
{
  "statusCode": 400,
  "message": "Invalid MFA code",
  "error": "Bad Request"
}
```

### MFA Required Response

```json
{
  "message": "MFA verification required",
  "requiresMfa": true,
  "mfaMethods": [
    { "type": "TOTP", "isEnabled": true },
    { "type": "SMS", "isEnabled": true }
  ],
  "hasBackupCodes": true
}
```

## Configuration

### Environment Variables

```env
# JWT Configuration
SUPABASE_JWT_SECRET=your-jwt-secret

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application Configuration
APPLICATION_BASE_URL=http://localhost:3000

# SMS Configuration (TODO)
SMS_PROVIDER_API_KEY=your-sms-api-key
SMS_PROVIDER_SECRET=your-sms-secret
```

## Testing

### Unit Tests

- MFA service methods
- Authentication flows
- Code generation and verification
- Backup code management

### Integration Tests

- Complete login flows
- MFA setup and verification
- Session management
- Error scenarios

### Security Tests

- Rate limiting
- Code expiration
- Session hijacking prevention
- Brute force protection

## Deployment Checklist

1. **Database Migration**
   - Run Prisma migrations
   - Verify new tables created
   - Test relationships

2. **Dependencies**
   - Install `otplib` package
   - Update Prisma client
   - Verify all imports

3. **Configuration**
   - Set environment variables
   - Configure email service
   - Setup SMS service (if applicable)

4. **Testing**
   - Run all tests
   - Test MFA flows
   - Verify security measures

5. **Monitoring**
   - Setup logging for MFA events
   - Monitor failed attempts
   - Track usage statistics

## Future Enhancements

1. **Additional MFA Methods**
   - Hardware security keys (WebAuthn)
   - Biometric authentication
   - Push notifications

2. **Advanced Security**
   - Device fingerprinting
   - Location-based restrictions
   - Risk-based authentication

3. **User Experience**
   - Remember device option
   - Progressive MFA setup
   - Mobile app integration

4. **Administration**
   - Admin MFA management
   - Bulk operations
   - Audit logging
