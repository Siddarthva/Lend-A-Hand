import { isDev } from '../config/env.js';

/**
 * Global error handler — normalises Mongoose, JWT, and generic errors.
 */
const errorHandler = (err, _req, res, _next) => {
    let status = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose validation
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map((e) => e.message).join('. ');
    }
    // Duplicate key
    if (err.code === 11000) {
        status = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `An account with that ${field} already exists.`;
    }
    // Bad ObjectId
    if (err.name === 'CastError') {
        status = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // JWT
    if (err.name === 'JsonWebTokenError') { status = 401; message = 'Invalid token.'; }
    if (err.name === 'TokenExpiredError') { status = 401; message = 'Token expired.'; }

    res.status(status).json({
        message,
        ...(isDev && { stack: err.stack }),
    });
};

export default errorHandler;
