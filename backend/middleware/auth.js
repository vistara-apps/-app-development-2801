import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

// Generate JWT tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

// Verify JWT token
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyToken(token);
      
      if (decoded.type !== 'access') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token type'
        });
      }

      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not found'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          error: 'Account Locked',
          message: 'Account is temporarily locked due to multiple failed login attempts'
        });
      }

      // Check subscription status
      if (user.subscriptionStatus !== 'active') {
        return res.status(402).json({
          error: 'Payment Required',
          message: 'Active subscription required'
        });
      }

      req.user = user;
      next();
    } catch (tokenError) {
      logger.warn('Token verification failed:', tokenError.message);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

// API Key authentication middleware
export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'API key required'
      });
    }

    const user = await User.findByApiKey(apiKey);
    
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Check subscription status
    if (user.subscriptionStatus !== 'active') {
      return res.status(402).json({
        error: 'Payment Required',
        message: 'Active subscription required'
      });
    }

    // Check API call limits
    const limits = user.checkLimits();
    if (!limits.canMakeApiCall) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'API call limit exceeded for your subscription tier',
        limits: limits.limits,
        usage: limits.usage
      });
    }

    // Increment API call count
    user.usage.apiCalls += 1;
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    logger.error('API key authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

// Optional authentication middleware (for public endpoints that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      req.user = user;
    } catch (tokenError) {
      req.user = null;
    }
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Authorization middleware for different subscription tiers
export const requireSubscription = (requiredTier) => {
  const tierLevels = {
    free: 0,
    basic: 1,
    pro: 2,
    enterprise: 3
  };

  return (req, res, next) => {
    const userTierLevel = tierLevels[req.user.subscriptionTier] || 0;
    const requiredTierLevel = tierLevels[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `${requiredTier} subscription or higher required`,
        currentTier: req.user.subscriptionTier,
        requiredTier
      });
    }

    next();
  };
};

// Check usage limits middleware
export const checkUsageLimits = (limitType) => {
  return (req, res, next) => {
    const limits = req.user.checkLimits();
    
    switch (limitType) {
      case 'dataGeneration':
        if (!limits.canGenerateData) {
          return res.status(429).json({
            error: 'Limit Exceeded',
            message: 'Data generation limit exceeded for your subscription tier',
            limits: limits.limits,
            usage: limits.usage
          });
        }
        break;
        
      case 'jobCreation':
        if (!limits.canCreateJob) {
          return res.status(429).json({
            error: 'Limit Exceeded',
            message: 'Job creation limit exceeded for your subscription tier',
            limits: limits.limits,
            usage: limits.usage
          });
        }
        break;
        
      case 'apiCall':
        if (!limits.canMakeApiCall) {
          return res.status(429).json({
            error: 'Limit Exceeded',
            message: 'API call limit exceeded for your subscription tier',
            limits: limits.limits,
            usage: limits.usage
          });
        }
        break;
    }
    
    next();
  };
};

// Email verification middleware
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      error: 'Email Verification Required',
      message: 'Please verify your email address to access this feature'
    });
  }
  next();
};

// Admin middleware (for future admin features)
export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
  next();
};

export default {
  authenticate,
  authenticateApiKey,
  optionalAuth,
  requireSubscription,
  checkUsageLimits,
  requireEmailVerification,
  requireAdmin,
  generateTokens,
  verifyToken
};
