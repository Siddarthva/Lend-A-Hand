import {
    MOCK_SERVICES,
    MOCK_BOOKINGS,
    MOCK_NOTIFICATIONS,
    MOCK_CHATS,
    MOCK_PROVIDER_JOBS,
    MOCK_REVIEWS,
    COUPON_CODES,
} from '../data/mockData';
import { storage } from './storage';

// Wrap any synchronous value in a promise with artificial delay
const api = (fn, delay = 400) =>
    new Promise((resolve) => setTimeout(() => resolve(fn()), delay));

const apiWithError = (fn, delay = 400, errorRate = 0) =>
    new Promise((resolve, reject) =>
        setTimeout(() => {
            if (Math.random() < errorRate) {
                reject(new Error('Network error. Please try again.'));
            } else {
                resolve(fn());
            }
        }, delay)
    );

// Services
export const fetchServices = () => api(() => MOCK_SERVICES);
export const fetchServiceById = (id) => api(() => MOCK_SERVICES.find(s => s.id === id));

// Bookings — always read from storage so mutations persist
export const fetchBookings = (userId) =>
    api(() => {
        const stored = storage.get('bookings', MOCK_BOOKINGS);
        return stored.filter(b => b.customerId === userId);
    });

export const submitBookingApi = (booking) =>
    api(() => {
        const stored = storage.get('bookings', MOCK_BOOKINGS);
        const updated = [booking, ...stored];
        storage.set('bookings', updated);
        return booking;
    }, 1200);

export const updateBookingStatus = (bookingId, newStatus) =>
    api(() => {
        const stored = storage.get('bookings', MOCK_BOOKINGS);
        const updated = stored.map(b => {
            if (b.id !== bookingId) return b;
            const now = new Date().toISOString();
            return {
                ...b,
                status: newStatus,
                statusHistory: [...(b.statusHistory || []), { status: newStatus, timestamp: now }],
            };
        });
        storage.set('bookings', updated);
        return updated.find(b => b.id === bookingId);
    }, 600);

// Reviews
export const fetchReviews = (serviceId) =>
    api(() => {
        const stored = storage.get('reviews', MOCK_REVIEWS);
        return stored.filter(r => r.serviceId === serviceId);
    });

export const submitReviewApi = (review) =>
    api(() => {
        const stored = storage.get('reviews', MOCK_REVIEWS);
        const updated = [review, ...stored];
        storage.set('reviews', updated);
        return review;
    }, 800);

// Notifications
export const fetchNotifications = (userId) =>
    api(() => {
        const stored = storage.get('notifications', MOCK_NOTIFICATIONS);
        return stored.filter(n => !n.userId || n.userId === userId);
    });

// Chats
export const fetchChats = (userId) =>
    api(() => {
        const stored = storage.get('chats', MOCK_CHATS);
        return stored.filter(c => c.customerId === userId || c.providerId === userId);
    });

// Provider jobs
export const fetchProviderJobs = () => api(() => {
    return storage.get('providerJobs', MOCK_PROVIDER_JOBS);
});

// Payment
export const processMockPayment = (method, amount) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            // 5% failure rate for realism
            if (Math.random() < 0.05) {
                reject(new Error('Payment declined. Please check your details.'));
            } else {
                resolve({ transactionId: 'TXN' + Date.now(), method, amount, status: 'success' });
            }
        }, 2000);
    });

// Coupon validation
export const validateCoupon = (code) =>
    api(() => {
        const coupon = COUPON_CODES[code.toUpperCase()];
        if (!coupon) throw new Error('Invalid coupon code');
        return coupon;
    }, 600);
