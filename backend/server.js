import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { ENV } from './src/config/env.js';
import mongoose from 'mongoose';

// ── Boot ────────────────────────────────
const start = async () => {
    await connectDB();

    const server = app.listen(ENV.PORT, () => {
        console.log(`🚀 Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
        console.log(`📋 Health check: http://localhost:${ENV.PORT}/health`);
    });

    // ── Graceful shutdown ─────────────────
    const shutdown = async (signal) => {
        console.log(`\n⚡ ${signal} received — shutting down gracefully…`);
        server.close(async () => {
            await mongoose.connection.close();
            console.log('🔌 MongoDB disconnected');
            process.exit(0);
        });
        // Force exit after 10s
        setTimeout(() => process.exit(1), 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Catch unhandled rejections / exceptions
    process.on('unhandledRejection', (err) => {
        console.error('💥 Unhandled Rejection:', err);
        shutdown('UNHANDLED_REJECTION');
    });
    process.on('uncaughtException', (err) => {
        console.error('💥 Uncaught Exception:', err);
        shutdown('UNCAUGHT_EXCEPTION');
    });
};

start();
