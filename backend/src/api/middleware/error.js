import { logger } from '../../utils/logger.js';

/**
 * Centralized Error Handler Middleware
 * Replaces the Java scattered try-catch blocks with e.printStackTrace()
 * Consistent error responses across all endpoints
 */
const errorHandler = (err, req, res, _) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`Error in ${req.method} ${req.path}:`, err);

    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Helper function to create operational errors
 */
const createError = (message, status = 500) => {
    const error = new Error(message);
    error.status = status;
    error.isOperational = true;
    return error;
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export { asyncHandler, createError, errorHandler };
