import mongoose from 'mongoose';
import { ENV, isDev } from './env.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        if (isDev) mongoose.set('debug', false);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};
