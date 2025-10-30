# Glow Track Backend API

Backend API for Glow Track - Patient-centric aesthetic treatment tracking system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup database
createdb glowtrack_db

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Run migrations (auto-sync in development)
npm run start:dev
```

### Development

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📚 API Documentation

Once running, visit:
- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs

## 🗄️ Database Setup

### Using Docker (Recommended)

```bash
docker run --name glowtrack-postgres \
  -e POSTGRES_DB=glowtrack_db \
  -e POSTGRES_USER=glowtrack \
  -e POSTGRES_PASSWORD=glowtrack_password \
  -p 5432:5432 \
  -d postgres:14
```

### Manual Setup

```sql
CREATE DATABASE glowtrack_db;
CREATE USER glowtrack WITH PASSWORD 'glowtrack_password';
GRANT ALL PRIVILEGES ON DATABASE glowtrack_db TO glowtrack;
```

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Grant-based Authorization (X-Grant-Id)
- ✅ 2FA Support
- ✅ Audit Logging
- ✅ Bcrypt Password Hashing
- ✅ Input Validation
- ✅ SQL Injection Protection (TypeORM)

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Patients
- `GET /api/v1/patients/:id` - Get patient
- `PUT /api/v1/patients/:id` - Update patient
- `GET /api/v1/patients/:id/entries` - Get patient entries

### Professionals
- `GET /api/v1/professionals/:id` - Get professional
- `PUT /api/v1/professionals/:id` - Update professional
- `GET /api/v1/professionals/:id/entries` - Get professional entries

### Centers
- `GET /api/v1/centers` - Get all centers
- `POST /api/v1/centers` - Create center
- `GET /api/v1/centers/:id` - Get center
- `PUT /api/v1/centers/:id` - Update center

### Entries
- `POST /api/v1/entries` - Create entry (requires X-Grant-Id)
- `GET /api/v1/entries/:id` - Get entry
- `PUT /api/v1/entries/:id` - Update entry
- `DELETE /api/v1/entries/:id` - Delete entry
- `POST /api/v1/entries/:id/medications` - Add medication
- `POST /api/v1/entries/:id/devices` - Add device

### Authorizations
- `POST /api/v1/authorizations/patients/:patientId` - Create authorization
- `GET /api/v1/authorizations/patients/:patientId` - Get patient authorizations
- `POST /api/v1/authorizations/validate` - Validate authorization
- `POST /api/v1/authorizations/:id/revoke` - Revoke authorization

### Audit Logs
- `GET /api/v1/audit-logs` - Get audit logs

## 🔐 Grant System

The Grant system allows patients to temporarily authorize professionals to create entries.

### Flow

1. **Patient creates authorization**:
```bash
POST /api/v1/authorizations/patients/{patientId}
{
  "type": "QR_CODE",
  "expiresInHours": 24,
  "maxUses": 1,
  "requires2FA": true,
  "permissions": {
    "canCreateEntry": true,
    "canViewHistory": false,
    "canUploadPhotos": true,
    "entryTypes": ["TREATMENT"]
  }
}
```

2. **Professional validates authorization**:
```bash
POST /api/v1/authorizations/validate
{
  "token": "glowtrack_grant_abc123...",
  "twoFactorCode": "123456"  # If 2FA required
}
```

3. **Professional creates entry with grant**:
```bash
POST /api/v1/entries
Headers:
  Authorization: Bearer {jwt_token}
  X-Grant-Id: glowtrack_grant_abc123...
Body: { entry data }
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── guards/          # JWT & Grant guards
│   ├── strategies/      # Passport strategies
│   └── decorators/      # Custom decorators
├── database/
│   └── entities/        # TypeORM entities
├── modules/
│   ├── patients/        # Patients module
│   ├── professionals/   # Professionals module
│   ├── centers/         # Centers module
│   ├── entries/         # Entries module
│   ├── authorizations/  # Authorizations module
│   └── audit-logs/      # Audit logs module
└── config/              # Configuration files
```

## 🌍 Environment Variables

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=glowtrack
DB_PASSWORD=glowtrack_password
DB_DATABASE=glowtrack_db

JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=7d

CORS_ORIGIN=http://localhost:19000,http://localhost:19006
```

## 🔄 Migrations

```bash
# Generate migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 📝 License

Private and confidential.

## 👥 Support

- Email: development@glowtrack.com
- Docs: http://localhost:3000/api/docs
