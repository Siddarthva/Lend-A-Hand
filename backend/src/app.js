import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { ENV, isDev } from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Route modules
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import providerRoutes from './routes/provider.routes.js';
import serviceRoutes from './routes/service.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// ── Security ────────────────────────────
app.use(helmet());
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
}));

// ── Rate limiting ───────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ── Body parsing ────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────
app.use(morgan(isDev ? 'dev' : 'combined'));

// ── Health check ────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        environment: ENV.NODE_ENV,
    });
});

// ── API routes ──────────────────────────
const API = '/api/v1';

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/providers`, providerRoutes);
app.use(`${API}/services`, serviceRoutes);
app.use(`${API}/bookings`, bookingRoutes);
app.use(`${API}/payments`, paymentRoutes);
app.use(`${API}/reviews`, reviewRoutes);
app.use(`${API}/messages`, messageRoutes);
app.use(`${API}/notifications`, notificationRoutes);
app.use(`${API}/admin`, adminRoutes);

// ── Error handling ──────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
