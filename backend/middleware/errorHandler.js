import { logger } from '../utils/logger.js';

// Custom error class for application errors
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle different types of errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Please upload a smaller file.', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Please upload fewer files.', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field. Please check your upload.', 400);
  }
  return new AppError('File upload error. Please try again.', 400);
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

// Main error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'MulterError') error = handleMulterError(error);

    sendErrorProd(error, res);
  }
};

// Async error wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler for undefined routes
export const notFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

// Validation error handler
export const validationError = (errors) => {
  const message = errors.map(error => error.msg).join('. ');
  return new AppError(`Validation Error: ${message}`, 400);
};

// Database connection error handler
export const handleDBError = (error) => {
  logger.error('Database connection error:', error);
  
  if (error.name === 'MongoNetworkError') {
    return new AppError('Database connection failed. Please try again later.', 503);
  }
  
  if (error.name === 'MongoTimeoutError') {
    return new AppError('Database operation timed out. Please try again.', 504);
  }
  
  return new AppError('Database error occurred.', 500);
};

// Rate limit error handler
export const handleRateLimitError = (retryAfter) => {
  return new AppError(
    `Too many requests. Please try again in ${retryAfter} seconds.`,
    429
  );
};

// File processing error handler
export const handleFileError = (error) => {
  if (error.code === 'ENOENT') {
    return new AppError('File not found.', 404);
  }
  
  if (error.code === 'EACCES') {
    return new AppError('Permission denied to access file.', 403);
  }
  
  if (error.code === 'EMFILE' || error.code === 'ENFILE') {
    return new AppError('Too many files open. Please try again later.', 503);
  }
  
  return new AppError('File processing error.', 500);
};

// Payment processing error handler
export const handlePaymentError = (error) => {
  if (error.type === 'StripeCardError') {
    return new AppError(`Payment failed: ${error.message}`, 402);
  }
  
  if (error.type === 'StripeInvalidRequestError') {
    return new AppError('Invalid payment request.', 400);
  }
  
  if (error.type === 'StripeAPIError') {
    return new AppError('Payment service temporarily unavailable.', 503);
  }
  
  return new AppError('Payment processing error.', 500);
};

export default errorHandler;
