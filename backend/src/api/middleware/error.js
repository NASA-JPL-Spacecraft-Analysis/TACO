import { logger } from '../../utils/logger.js';

/**
 * Express error-handling middleware.
 * Catches all errors passed to `next()` and sends a standardized JSON response.
 * Logs the error and optionally includes the stack trace in development mode.
 *
 * @param {Error & { status?: number }} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} _ - The Express next function (unused).
 */
const errorHandler = (err, req, res, _) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`Error in ${req.method} ${req.path}:`, err);

    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Creates a standardized operational error.
 * Can be thrown or passed to `next()` to trigger the error handler.
 *
 * @param {string} message - Error message.
 * @param {number} [status=500] - HTTP status code.
 * @returns {Error} The error object with added `status` and `isOperational` properties.
 */
const createError = (message, status = 500) => {
    const error = new Error(message);
    error.status = status;
    error.isOperational = true;
    return error;
};

/**
 * Wraps an async Express route handler to automatically catch rejected promises.
 * Prevents repetitive try/catch blocks in each async route.
 *
 * @param {RequestHandler} fn - The async route handler.
 * @returns {RequestHandler} - A wrapped route handler that forwards errors to `next()`.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export { asyncHandler, createError, errorHandler };
