import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import jobRoutes from './routes/jobs.js';
import dataRoutes from './routes/data.js';
import subscriptionRoutes from './routes/subscriptions.js';
import analyticsRoutes from './routes/analytics.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Static file serving for uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/analytics', analyticsRoutes);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'SampleShield Pro API',
    version: '1.0.0',
    description: 'API for synthetic data generation and privacy compliance',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'User login',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/logout': 'User logout'
      },
      users: {
        'GET /api/users/profile': 'Get user profile',
        'PUT /api/users/profile': 'Update user profile',
        'DELETE /api/users/account': 'Delete user account'
      },
      jobs: {
        'GET /api/jobs': 'List user jobs',
        'POST /api/jobs': 'Create new data generation job',
        'GET /api/jobs/:id': 'Get job details',
        'PUT /api/jobs/:id': 'Update job',
        'DELETE /api/jobs/:id': 'Delete job',
        'POST /api/jobs/:id/start': 'Start job execution',
        'GET /api/jobs/:id/status': 'Get job status',
        'GET /api/jobs/:id/download': 'Download generated data'
      },
      data: {
        'POST /api/data/upload': 'Upload dataset for augmentation',
        'POST /api/data/generate': 'Generate synthetic data',
        'POST /api/data/anonymize': 'Anonymize existing data',
        'GET /api/data/templates': 'Get data generation templates'
      },
      subscriptions: {
        'GET /api/subscriptions/plans': 'Get subscription plans',
        'POST /api/subscriptions/subscribe': 'Subscribe to plan',
        'GET /api/subscriptions/current': 'Get current subscription',
        'POST /api/subscriptions/cancel': 'Cancel subscription'
      },
      analytics: {
        'GET /api/analytics/dashboard': 'Get dashboard analytics',
        'GET /api/analytics/usage': 'Get usage statistics'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server...');
  
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`🚀 SampleShield Pro API server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
