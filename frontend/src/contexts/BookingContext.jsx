import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_BOOKINGS } from '../data/mockData';
import { storage } from '../utils/storage';
import { submitBookingApi, updateBookingStatus } from '../utils/mockApi';

const BookingContext = createContext();

export const BOOKING_STATUS = {
    REQUESTED: 'Requested',
    CONFIRMED: 'Confirmed',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

const initialWizard = {
    step: 1,
    service: null,
    provider: null,
    date: '',
    time: '',
    address: '',
    recurring: null,   // null | 'weekly' | 'monthly'
    coupon: null,
    paymentMethod: null,
};

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState(() => storage.get('bookings', MOCK_BOOKINGS));
    const [wizard, setWizard] = useState(initialWizard);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync bookings to storage
    const persistBookings = useCallback((updated) => {
        setBookings(updated);
        storage.set('bookings', updated);
    }, []);

    // Wizard controls
    const startWizard = useCallback((service) => {
        setWizard({ ...initialWizard, service, step: 1 });
    }, []);

    const advanceWizard = useCallback((stepData) => {
        setWizard(prev => ({ ...prev, ...stepData, step: prev.step + 1 }));
    }, []);

    const goToStep = useCallback((step) => {
        setWizard(prev => ({ ...prev, step }));
    }, []);

    const resetWizard = useCallback(() => {
        setWizard(initialWizard);
    }, []);

    // Submit a new booking
    const submitBooking = useCallback(async (userId, paymentResult) => {
        setIsSubmitting(true);
        const service = wizard.service;
        const base = service.price;
        const platformFee = service.platformFee || 10;
        const tax = parseFloat(((base + platformFee) * 0.1).toFixed(2));
        const total = base + platformFee + tax;

        const newBooking = {
            id: 'b_' + Date.now(),
            customerId: userId,
            serviceId: service.id,
            service,
            providerId: service.providerId,
            providerName: service.provider,
            date: wizard.date,
            time: wizard.time,
            address: wizard.address,
            status: BOOKING_STATUS.REQUESTED,
            recurring: wizard.recurring,
            price: base,
            platformFee,
            tax,
            total,
            coupon: wizard.coupon,
            paymentMethod: wizard.paymentMethod || 'Card',
            paymentStatus: 'Paid',
            transactionId: paymentResult?.transactionId,
            createdAt: new Date().toISOString().split('T')[0],
            reviewId: null,
            statusHistory: [{ status: BOOKING_STATUS.REQUESTED, timestamp: new Date().toISOString() }],
        };

        try {
            const saved = await submitBookingApi(newBooking);
            const updated = [saved, ...bookings];
            persistBookings(updated);
            return saved;
        } finally {
            setIsSubmitting(false);
        }
    }, [wizard, bookings, persistBookings]);

    const cancelBooking = useCallback(async (bookingId) => {
        const updated = await updateBookingStatus(bookingId, BOOKING_STATUS.CANCELLED);
        const newList = bookings.map(b => b.id === bookingId ? updated : b);
        persistBookings(newList);
        return updated;
    }, [bookings, persistBookings]);

    const rescheduleBooking = useCallback(async (bookingId, date, time) => {
        const newList = bookings.map(b => {
            if (b.id !== bookingId) return b;
            const now = new Date().toISOString();
            return {
                ...b,
                date,
                time,
                status: BOOKING_STATUS.REQUESTED,
                statusHistory: [...(b.statusHistory || []), { status: 'Rescheduled', timestamp: now }],
            };
        });
        persistBookings(newList);
        storage.set('bookings', newList);
    }, [bookings, persistBookings]);

    const getUserBookings = useCallback((userId) => {
        return bookings.filter(b => b.customerId === userId);
    }, [bookings]);

    const getBookingById = useCallback((id) => {
        return bookings.find(b => b.id === id);
    }, [bookings]);

    const markReviewed = useCallback((bookingId, reviewId) => {
        const updated = bookings.map(b => b.id === bookingId ? { ...b, reviewId } : b);
        persistBookings(updated);
    }, [bookings, persistBookings]);

    return (
        <BookingContext.Provider value={{
            bookings,
            wizard, startWizard, advanceWizard, goToStep, resetWizard,
            submitBooking, cancelBooking, rescheduleBooking,
            getUserBookings, getBookingById, markReviewed,
            isSubmitting,
            BOOKING_STATUS,
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
    return ctx;
};
