import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ENV } from '../config/env.js';

/**
 * Protect routes — verifies access token and attaches req.user.
 */
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated. Please log in.' });
        }

        const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists.' });
        }
        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account is suspended or banned.' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please refresh.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

/**
 * RBAC — restrict to specific roles.
 * Usage: authorize('admin', 'provider')
 */
export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    next();
};
