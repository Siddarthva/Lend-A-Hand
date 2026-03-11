import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

// ── Token helpers ───────────────────────

export const generateAccessToken = (userId) =>
    jwt.sign({ id: userId }, ENV.JWT_ACCESS_SECRET, { expiresIn: ENV.JWT_ACCESS_EXPIRES_IN });

export const generateRefreshToken = (userId) =>
    jwt.sign({ id: userId }, ENV.JWT_REFRESH_SECRET, { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN });

export const verifyRefreshToken = (token) =>
    jwt.verify(token, ENV.JWT_REFRESH_SECRET);

// ── Custom AppError ─────────────────────

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// ── Async wrapper ───────────────────────

export const catchAsync = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ── Pagination helper ───────────────────

import { PAGINATION } from '../config/constants.js';

export const paginate = (query) => {
    const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
    const limit = Math.min(
        Math.max(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
        PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// ── Response formatter ──────────────────

export const sendSuccess = (res, data, statusCode = 200, meta = {}) => {
    res.status(statusCode).json({ success: true, ...meta, data });
};

export const sendPaginated = (res, data, page, limit, total) => {
    res.json({
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
};

// ── Date helpers ────────────────────────

export const toISO = (date) => new Date(date).toISOString();
export const now = () => new Date();
