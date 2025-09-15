# Tutors Booking System

API for tutoring lessons booking platform.

## 📋 What the API does

### Authentication

- User registration
- User login
- JWT tokens for authorization

### Tutor management

- View list of all tutors

### Lesson booking

- Create new bookings
- View your bookings
- Delete bookings
- Check schedule conflicts

## 🔗 API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

### Tutors

- `GET /tutor` - Get list of all tutors

### Bookings (requires authorization)

- `POST /booking` - Create new booking
- `GET /booking` - Get your bookings
- `DELETE /booking/:id` - Delete booking

### Documentation

- `GET /api` - Swagger API documentation
- `GET /` - Server health check

## 🛠️ Installation

### Local development

1. **Clone repository**

```bash
git clone <repo-url>
cd server
```

2. **Установить зависимости**

```bash
pnpm install
```

3. **Setup environment**

```bash
cp .env.example .env
# Edit .env with your database settings
```

4. **Start application**

```bash
pnpm start:dev
```

### Docker

1. **Start with Docker Compose**

```bash
pnpm docker-start
```

2. **View logs**

```bash
pnpm docker-logs      # Application logs
pnpm docker-logs-db   # Database logs
```

3. **Stop**

```bash
pnpm docker-stop      # Stop containers
pnpm docker-reset     # Stop + clear volumes
```

## 🚨 Error handling

### Validation errors (400)

- **Past dates**: "Cannot book a lesson in the past. Please choose a future date and time."
- **User schedule conflict**: "You already have a lesson scheduled at this time. Please choose a different time slot."
- **Tutor schedule conflict**: "Tutor is not available during this time period."
- **Missing fields**: Validation errors for missing required fields
- **Invalid email format**: Email validation errors
- **Short password**: Minimum 6 characters

### Ошибки аутентификации (401)

- **Неверные данные**: "Invalid credentials"
- **Отсутствие токена**: "Unauthorized"
- **Invalid token**: JWT verification errors

### Not found errors (404)

- **Booking not found**: "Booking not found"

### Duplication errors (400)

- **Email already taken**: "Email already taken"

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

## 📚 Commands

```bash
# Development
pnpm start:dev       # Start with auto-reload
pnpm start:debug     # Debug mode

# Build
pnpm build           # Build for production
pnpm start:prod      # Start production build

# Docker
pnpm docker-start    # Start containers
pnpm docker-stop     # Stop containers
pnpm docker-reset    # Stop + clear volumes
pnpm docker-logs     # Application logs
pnpm docker-logs-db  # Database logs

# Testing
pnpm test            # Unit tests
pnpm test:e2e        # End-to-end tests
pnpm test:cov        # Coverage report
pnpm test:watch      # Watch mode

# Code quality
pnpm lint            # ESLint with auto-fix
pnpm format          # Prettier formatting
```

## 🎯 API usage examples

### User registration

```bash
curl -X POST http://localhost:3010/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

### Login

```bash
curl -X POST http://localhost:3010/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create booking

```bash
curl -X POST http://localhost:3010/booking \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tutorId":1,"date":"2024-12-25","startTime":"10:00","endTime":"11:00"}'
```

### Get tutors list

```bash
curl http://localhost:3010/tutor
```

## 📝 Environment variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
JWT_SECRET=your-secret-key

# Application
PORT=3000
NODE_ENV=development
```

## 🔒 Business logic

### Booking creation checks

1. **Time check**: Cannot book lesson in the past
2. **User check**: User should not have overlapping lessons
3. **Tutor check**: Tutor should be available at specified time

### Overlap checking algorithm

```sql
-- Time overlap check
(booking.startTime < :endTime AND booking.endTime > :startTime)
```

### Error checking order

1. Past time (priority over conflicts)
2. User schedule conflict
3. Tutor schedule conflict

- **TypeScript 5.7.3** - Type-safe JavaScript

### Database & ORM

- **PostgreSQL** - Primary database
- **TypeORM 0.3.26** - Object-Relational Mapping
- **SQLite3 5.1.7** - Testing database

### Authentication & Security

- **JWT (@nestjs/jwt 11.0.0)** - JSON Web Tokens
- **Passport 0.7.0** - Authentication middleware
- **bcrypt 6.0.0** - Password hashing

### Documentation & API

- **Swagger (@nestjs/swagger 11.2.0)** - API documentation
- **Express** - Web framework

### Testing

- **Jest 30.0.0** - Testing framework
- **Supertest 7.0.0** - HTTP testing
- **ts-jest 29.2.5** - TypeScript Jest preset

### Development Tools

- **ESLint 9.18.0** - Code linting
- **Prettier 3.4.2** - Code formatting
- **typescript-eslint 8.20.0** - TypeScript linting rules

### Package Management

- **pnpm** - Fast, disk space efficient package manager

### Containerization

- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration

## 📋 Features

- User authentication (signup/login)
- Tutor management
- Lesson booking with conflict prevention
- Time validation (no past bookings)
- User and tutor availability checking
- RESTful API with Swagger documentation

## 🛠️ Installation

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (or Docker)

### Local Development

1. **Clone repository**

```bash
git clone <repo-url>
cd server
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Start PostgreSQL and run application**

```bash
pnpm start:dev
```

### Docker Development

1. **Start with Docker Compose**

```bash
pnpm docker-start
```

2. **View logs**

```bash
pnpm docker-logs      # App logs
pnpm docker-logs-db   # Database logs
```

3. **Stop containers**

```bash
pnpm docker-stop      # Stop containers
pnpm docker-reset     # Stop + clear volumes
```

## 🔗 API Endpoints

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Tutors

- `GET /tutor` - Get all tutors

### Bookings (Protected)

- `POST /booking` - Create new booking
- `GET /booking` - Get user's bookings
- `DELETE /booking/:id` - Delete booking

### Documentation

- `GET /api` - Swagger API documentation
- `GET /` - Health check

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch

# Debug tests
pnpm test:debug
```

### Test Configuration

- **Framework**: Jest 30.0.0
- **TypeScript**: ts-jest 29.2.5
- **HTTP Testing**: supertest 7.0.0
- **Coverage**: Automatic collection from src/\*_/_.(t|j)s
- **Environment**: Node.js

## 🚨 Error Handling

### Business Logic Errors (400)

- **Past bookings**: "Cannot book a lesson in the past"
- **User conflicts**: "You already have a lesson scheduled at this time"
- **Tutor conflicts**: "Tutor is not available during this time period"
- **Invalid data**: Validation errors for missing/invalid fields

### Authentication Errors (401)

- **Invalid credentials**: "Invalid email or password"
- **Missing token**: "Unauthorized access"
- **Invalid token**: JWT verification failures

### Not Found Errors (404)

- **Booking not found**: When accessing non-existent bookings
- **User not found**: When user doesn't exist

### Validation Errors (400)

- **Email format**: Invalid email addresses
- **Password length**: Minimum 6 characters required
- **Required fields**: Missing tutorId, date, startTime, endTime
- **Time format**: Invalid time format (HH:MM expected)

## 📊 Database Schema

### Users

```sql
- id (Primary Key)
- email (Unique)
- password (Hashed)
```

### Tutors

```sql
- id (Primary Key)
- name
```

### Bookings

```sql
- id (Primary Key)
- date (YYYY-MM-DD)
- startTime (HH:MM)
- endTime (HH:MM)
- userId (Foreign Key)
- tutorId (Foreign Key)
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth with @nestjs/jwt
- **Password Hashing**: bcrypt 6.0.0 with salt
- **Input Validation**: class-validator with comprehensive rules
- **Database Security**: PostgreSQL not exposed externally in Docker
- **Environment Variables**: Sensitive data in .env files
- **Type Safety**: Full TypeScript coverage

## 🐳 Docker Configuration

### Services

- **tutors-server**: NestJS app on port 3010
- **tutors-postgres**: PostgreSQL database (internal only)

### Images

- **Node.js**: 20-alpine (lightweight)
- **PostgreSQL**: 15-alpine

### Security

- PostgreSQL accessible only within Docker network
- Strong passwords for database
- Separate environments for dev/prod

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
JWT_SECRET=your-secret-key

# Application
PORT=3000
NODE_ENV=development
```

## 🚀 Deployment

### Production Build

```bash
pnpm build
pnpm start:prod
```

### Docker Production

```bash
docker compose up --build -d
```

## 📚 Scripts Reference

```bash
# Development
pnpm start           # Start application
pnpm start:dev       # Development with watch
pnpm start:debug     # Debug mode

# Building
pnpm build           # Build for production
pnpm start:prod      # Start production build

# Docker
pnpm docker-start    # Start containers
pnpm docker-stop     # Stop containers
pnpm docker-reset    # Reset with volume cleanup
pnpm docker-logs     # View app logs
pnpm docker-logs-db  # View database logs

# Testing
pnpm test            # Unit tests
pnpm test:e2e        # End-to-end tests
pnpm test:cov        # Coverage report
pnpm test:watch      # Watch mode
pnpm test:debug      # Debug tests

# Code Quality
pnpm lint            # ESLint with auto-fix
pnpm format          # Prettier formatting
```

## 🎯 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:3010/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

### Login

```bash
curl -X POST http://localhost:3010/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Booking

```bash
curl -X POST http://localhost:3010/booking \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tutorId":1,"date":"2024-12-25","startTime":"10:00","endTime":"11:00"}'
```
