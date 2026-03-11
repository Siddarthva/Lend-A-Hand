import Transaction from '../models/Transaction.js';
import Booking from '../models/Booking.js';
import { PAYMENT_STATUS, TRANSACTION_TYPE } from '../config/constants.js';
import { AppError, paginate } from '../utils/helpers.js';

/**
 * Simulate payment initiation (placeholder for real gateway).
 */
export const initiatePayment = async (userId, { bookingId, method }) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.customer.toString() !== userId) throw new AppError('Not authorised', 403);

    // Simulate 5% failure rate for realism
    const success = Math.random() > 0.05;

    const txn = await Transaction.create({
        user: userId,
        booking: bookingId,
        type: TRANSACTION_TYPE.PAYMENT,
        amount: booking.totalAmount,
        method: method || booking.paymentMethod,
        status: success ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
        reference: 'TXN' + Date.now(),
        description: `Payment for booking #${booking._id.toString().slice(-6)}`,
    });

    if (success) {
        booking.paymentStatus = PAYMENT_STATUS.PAID;
        booking.transactionId = txn.reference;
        await booking.save();
    }

    return txn;
};

/**
 * Process refund.
 */
export const processRefund = async (userId, { bookingId }) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.paymentStatus !== PAYMENT_STATUS.PAID) {
        throw new AppError('Booking has not been paid', 400);
    }

    const txn = await Transaction.create({
        user: userId,
        booking: bookingId,
        type: TRANSACTION_TYPE.REFUND,
        amount: booking.totalAmount,
        method: booking.paymentMethod,
        status: PAYMENT_STATUS.PAID,
        reference: 'REF' + Date.now(),
        description: `Refund for booking #${booking._id.toString().slice(-6)}`,
    });

    booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
    await booking.save();

    return txn;
};

/**
 * Get user transactions.
 */
export const getUserTransactions = async (userId, query) => {
    const { page, limit, skip } = paginate(query);
    const [transactions, total] = await Promise.all([
        Transaction.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Transaction.countDocuments({ user: userId }),
    ]);
    return { transactions, page, limit, total };
};
