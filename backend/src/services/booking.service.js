import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import { BOOKING_STATUS } from '../config/constants.js';
import { AppError, paginate } from '../utils/helpers.js';
import { createNotification } from './notification.service.js';

/**
 * Create a new booking.
 */
export const createBooking = async (customerId, data) => {
    const service = await Service.findById(data.serviceId);
    if (!service) throw new AppError('Service not found', 404);

    const provider = await User.findById(data.providerId);
    if (!provider || provider.role !== 'provider') throw new AppError('Provider not found', 404);

    const customer = await User.findById(customerId);

    // Price calculation placeholder
    const amount = service.basePrice;
    const discount = 0;
    const tax = Math.round(amount * 0.18 * 100) / 100;  // 18% GST placeholder
    const totalAmount = amount - discount + tax;

    const booking = await Booking.create({
        customer: customerId,
        provider: data.providerId,
        service: data.serviceId,
        serviceTitle: service.name,
        providerName: provider.name,
        customerName: customer.name,
        scheduledStart: data.scheduledStart,
        scheduledEnd: data.scheduledEnd || null,
        address: data.address,
        notes: data.notes || '',
        amount,
        discount,
        tax,
        totalAmount,
        paymentMethod: data.paymentMethod || 'card',
        statusHistory: [{ status: BOOKING_STATUS.PENDING, note: 'Booking created' }],
    });

    // Notify provider
    await createNotification({
        userId: data.providerId,
        type: 'booking_update',
        title: 'New Booking Request',
        body: `${customer.name} requested "${service.name}"`,
        link: `/bookings/${booking._id}`,
    });

    return booking;
};

/**
 * Get bookings for a user (customer or provider).
 */
export const getUserBookings = async (userId, role, query) => {
    const { page, limit, skip } = paginate(query);
    const filter = role === 'provider' ? { provider: userId } : { customer: userId };
    if (query.status) filter.status = query.status;

    const [bookings, total] = await Promise.all([
        Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Booking.countDocuments(filter),
    ]);

    return { bookings, page, limit, total };
};

/**
 * Update booking status.
 */
export const updateBookingStatus = async (bookingId, userId, { status, note }) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    // Verify ownership
    const isCustomer = booking.customer.toString() === userId;
    const isProvider = booking.provider.toString() === userId;
    if (!isCustomer && !isProvider) throw new AppError('Not authorised', 403);

    booking.status = status;
    booking.statusHistory.push({ status, note: note || '' });

    // Provider completes → update stats
    if (status === BOOKING_STATUS.COMPLETED) {
        await ProviderProfile.findOneAndUpdate(
            { user: booking.provider },
            { $inc: { totalBookings: 1 } }
        );
    }

    await booking.save();

    // Notify the other party
    const notifyUser = isCustomer ? booking.provider : booking.customer;
    await createNotification({
        userId: notifyUser,
        type: 'booking_update',
        title: 'Booking Updated',
        body: `Booking #${booking._id.toString().slice(-6)} is now ${status}`,
        link: `/bookings/${booking._id}`,
    });

    return booking;
};

/**
 * Cancel booking.
 */
export const cancelBooking = async (bookingId, userId, reason) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    if (booking.customer.toString() !== userId && booking.provider.toString() !== userId) {
        throw new AppError('Not authorised', 403);
    }

    if ([BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].includes(booking.status)) {
        throw new AppError('Booking cannot be cancelled in its current state', 400);
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancelReason = reason || '';
    booking.statusHistory.push({ status: BOOKING_STATUS.CANCELLED, note: reason || 'Cancelled' });
    await booking.save();

    return booking;
};
