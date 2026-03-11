import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: parseInt(process.env.PORT, 10) || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lendahand',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'fallback_access',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback_refresh',
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export const isDev = ENV.NODE_ENV === 'development';
export const isProd = ENV.NODE_ENV === 'production';
