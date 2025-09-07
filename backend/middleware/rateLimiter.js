import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from '../utils/logger.js';

// Create different rate limiters for different endpoints
const rateLimiters = {
  // General API rate limiter
  general: new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Number of requests
    duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 900, // Per 15 minutes (900 seconds)
  }),

  // Strict rate limiter for auth endpoints
  auth: new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: 5, // 5 attempts
    duration: 900, // Per 15 minutes
    blockDuration: 900, // Block for 15 minutes
  }),

  // Rate limiter for password reset
  passwordReset: new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: 3, // 3 attempts
    duration: 3600, // Per hour
    blockDuration: 3600, // Block for 1 hour
  }),

  // Rate limiter for data generation
  dataGeneration: new RateLimiterMemory({
    keyGenerator: (req) => req.user?.id || req.ip,
    points: 10, // 10 jobs
    duration: 3600, // Per hour
  }),

  // Rate limiter for file uploads
  fileUpload: new RateLimiterMemory({
    keyGenerator: (req) => req.user?.id || req.ip,
    points: 20, // 20 uploads
    duration: 3600, // Per hour
  })
};

// Generic rate limiter middleware factory
const createRateLimiter = (limiterName = 'general') => {
  return async (req, res, next) => {
    const rateLimiter = rateLimiters[limiterName];
    
    if (!rateLimiter) {
      logger.warn(`Rate limiter '${limiterName}' not found, using general limiter`);
      return rateLimiters.general;
    }

    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch (rejRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      logger.warn(`Rate limit exceeded for IP: ${req.ip}, endpoint: ${req.originalUrl}`);
      
      res.set('Retry-After', String(secs));
      res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${secs} seconds.`,
        retryAfter: secs
      });
    }
  };
};

// Specific middleware exports
export const rateLimiter = createRateLimiter('general');
export const authRateLimiter = createRateLimiter('auth');
export const passwordResetRateLimiter = createRateLimiter('passwordReset');
export const dataGenerationRateLimiter = createRateLimiter('dataGeneration');
export const fileUploadRateLimiter = createRateLimiter('fileUpload');

// Custom rate limiter for API keys
export const apiKeyRateLimiter = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return next();
  }

  const rateLimiter = new RateLimiterMemory({
    keyGenerator: () => apiKey,
    points: 1000, // 1000 requests
    duration: 3600, // Per hour
  });

  try {
    await rateLimiter.consume(apiKey);
    next();
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    
    logger.warn(`API key rate limit exceeded: ${apiKey.substring(0, 10)}...`);
    
    res.set('Retry-After', String(secs));
    res.status(429).json({
      error: 'API Rate Limit Exceeded',
      message: `API rate limit exceeded. Try again in ${secs} seconds.`,
      retryAfter: secs
    });
  }
};

// Rate limiter for user-specific actions
export const userRateLimiter = (points = 100, duration = 3600) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const rateLimiter = new RateLimiterMemory({
      keyGenerator: () => req.user.id,
      points,
      duration
    });

    try {
      await rateLimiter.consume(req.user.id);
      next();
    } catch (rejRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      logger.warn(`User rate limit exceeded: ${req.user.email}`);
      
      res.set('Retry-After', String(secs));
      res.status(429).json({
        error: 'User Rate Limit Exceeded',
        message: `You have exceeded your rate limit. Try again in ${secs} seconds.`,
        retryAfter: secs
      });
    }
  };
};

export default rateLimiter;
