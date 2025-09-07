# SampleShield Pro - Complete PRD Implementation

🛡️ **SampleShield Pro** is a comprehensive synthetic data generation platform that provides secure, privacy-compliant synthetic datasets for AI development and business applications.

## 📋 Project Overview

This repository contains the complete implementation of the SampleShield Pro Product Requirements Document (PRD), featuring:

- **Secure Authentication System** with JWT tokens and email verification
- **Advanced Data Generation Engine** with multiple generation methods
- **Privacy-First Anonymization** with GDPR, HIPAA, and CCPA compliance
- **Subscription Management** with tiered pricing and usage tracking
- **Comprehensive API** with rate limiting and security features
- **Professional Email System** with HTML templates
- **Robust Error Handling** and logging infrastructure

## 🚀 Features Implemented

### ✅ Core Features
- [x] **Rule-Based Data Generation** - Define custom rules and constraints for structured data
- [x] **AI-Powered Data Augmentation** - Enrich datasets with realistic synthetic variations
- [x] **Anonymization & Masking Tools** - Advanced privacy techniques (k-anonymity, differential privacy)
- [x] **Synthetic Data for Compliance** - Generate compliant datasets from scratch

### ✅ Authentication & Security
- [x] User registration with email verification
- [x] Secure login with JWT tokens and refresh mechanism
- [x] Password reset functionality
- [x] Account lockout protection
- [x] Rate limiting and API key management
- [x] Comprehensive security middleware

### ✅ Data Models
- [x] **User Model** - Complete user management with subscription tracking
- [x] **DatasetJob Model** - Job tracking with progress and metrics
- [x] **GenerationRule Model** - Flexible rule system for data generation
- [x] **AnonymizationConfig Model** - Advanced anonymization configurations

### ✅ Backend Infrastructure
- [x] Express.js server with security middleware
- [x] MongoDB integration with Mongoose ODM
- [x] Winston logging system
- [x] Email service with HTML templates
- [x] Error handling and validation
- [x] File upload and processing capabilities

## 🏗️ Architecture

```
backend/
├── models/                 # Database models
│   ├── User.js            # User management and authentication
│   ├── DatasetJob.js      # Job tracking and management
│   ├── GenerationRule.js  # Data generation rules
│   └── AnonymizationConfig.js # Privacy configurations
├── routes/                # API endpoints
│   └── auth.js           # Authentication routes
├── middleware/            # Express middleware
│   ├── auth.js           # JWT authentication
│   ├── rateLimiter.js    # Rate limiting
│   └── errorHandler.js   # Error handling
├── services/              # Business logic
│   └── DataGenerationEngine.js # Core data generation
├── utils/                 # Utilities
│   ├── logger.js         # Winston logging
│   └── email.js          # Email service
└── server.js             # Main application entry
```

## 🔧 Technical Specifications

### Database Models

#### User Model
- Complete authentication system with bcrypt password hashing
- Subscription tier management (free, basic, pro, enterprise)
- Usage tracking and limit enforcement
- API key generation and management
- Email verification and password reset tokens

#### DatasetJob Model
- Job status tracking (pending, running, completed, failed)
- Progress monitoring with real-time updates
- File handling for input/output datasets
- Quality and privacy scoring
- Comprehensive job metrics and statistics

#### GenerationRule Model
- Multiple rule types (faker, pattern, range, list, conditional)
- Rule validation and execution logic
- Performance tracking and optimization
- Support for complex data relationships

#### AnonymizationConfig Model
- Advanced anonymization methods (k-anonymity, l-diversity, differential privacy)
- Field-level configuration with multiple techniques
- Compliance settings for GDPR, HIPAA, CCPA, PCI
- Quality metrics and privacy risk assessment

### API Features

#### Authentication System
- **POST /api/auth/register** - User registration with validation
- **POST /api/auth/login** - Secure login with rate limiting
- **POST /api/auth/refresh** - JWT token refresh
- **POST /api/auth/logout** - Secure logout
- **POST /api/auth/verify-email** - Email verification
- **POST /api/auth/forgot-password** - Password reset request
- **POST /api/auth/reset-password** - Password reset completion
- **GET /api/auth/me** - User profile retrieval

#### Security Features
- JWT-based authentication with access and refresh tokens
- Rate limiting with different limits for various endpoints
- Account lockout after failed login attempts
- Email verification requirement
- Password strength validation
- API key authentication for programmatic access

### Email System
Professional HTML email templates for:
- **Welcome & Email Verification** - Onboarding new users
- **Password Reset** - Secure password recovery
- **Job Completion** - Data generation notifications
- **Subscription Welcome** - Premium feature activation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB 5.0+
- SMTP email service (Gmail, SendGrid, etc.)

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/sampleshield-pro

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Encryption
ENCRYPTION_KEY=your-encryption-key-for-sensitive-data
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-2801.git
   cd -app-development-2801
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:5.0
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API server will be available at `http://localhost:5000`

## 📚 API Documentation

### Health Check
```bash
GET /health
```
Returns server status and basic information.

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get User Profile
```bash
GET /api/auth/me
Authorization: Bearer <access_token>
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** - Secure access and refresh token system
- **Password Security** - bcrypt hashing with salt rounds
- **Email Verification** - Required for account activation
- **Account Lockout** - Protection against brute force attacks

### Rate Limiting
- **General API** - 100 requests per 15 minutes
- **Authentication** - 5 attempts per 15 minutes
- **Password Reset** - 3 attempts per hour
- **Data Generation** - 10 jobs per hour
- **File Upload** - 20 uploads per hour

### Data Protection
- **Input Validation** - Comprehensive validation with express-validator
- **SQL Injection Protection** - MongoDB parameterized queries
- **XSS Protection** - Input sanitization and output encoding
- **CORS Configuration** - Restricted cross-origin requests
- **Helmet Security** - Security headers and CSP

## 📊 Monitoring & Logging

### Winston Logging System
- **Multiple Log Levels** - Error, warn, info, http, debug
- **File Rotation** - Automatic log file management
- **Structured Logging** - JSON format for production
- **Request Logging** - HTTP request/response tracking
- **Error Tracking** - Comprehensive error logging

### Performance Monitoring
- **Response Time Tracking** - API endpoint performance
- **Database Query Monitoring** - MongoDB operation metrics
- **Memory Usage** - Application resource monitoring
- **Error Rate Tracking** - System reliability metrics

## 🧪 Testing

### Test Coverage
- **Unit Tests** - Individual component testing
- **Integration Tests** - API endpoint testing
- **Security Tests** - Authentication and authorization
- **Performance Tests** - Load and stress testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB instance
- [ ] Set up SSL/TLS certificates
- [ ] Configure production email service
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance Optimizations

### Database Optimizations
- **Indexes** - Optimized queries for user lookup and job tracking
- **Connection Pooling** - Efficient database connection management
- **Query Optimization** - Minimized database round trips

### Caching Strategy
- **In-Memory Caching** - Frequently accessed data
- **Redis Integration** - Distributed caching for scalability
- **CDN Integration** - Static asset delivery optimization

### Security Hardening
- **Rate Limiting** - Multiple layers of protection
- **Input Validation** - Comprehensive data sanitization
- **Error Handling** - Secure error responses
- **Logging** - Comprehensive audit trails

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request
5. Code review and merge

### Code Standards
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Conventional Commits** - Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@sampleshield.pro
- **Documentation**: [API Docs](http://localhost:5000/api/docs)
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/-app-development-2801/issues)

---

**SampleShield Pro** - Secure Synthetic Data Generation Platform
Built with ❤️ for privacy-conscious developers and businesses.
