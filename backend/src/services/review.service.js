import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import ProviderProfile from '../models/ProviderProfile.js';
import { BOOKING_STATUS } from '../config/constants.js';
import { AppError, paginate } from '../utils/helpers.js';
import { createNotification } from './notification.service.js';

/**
 * Submit a review for a completed booking.
 */
export const submitReview = async (userId, data) => {
    const booking = await Booking.findById(data.bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.customer.toString() !== userId) throw new AppError('Not authorised', 403);
    if (booking.status !== BOOKING_STATUS.COMPLETED) {
        throw new AppError('Can only review completed bookings', 400);
    }

    // Check not already reviewed
    const existing = await Review.findOne({ customer: userId, booking: data.bookingId });
    if (existing) throw new AppError('You have already reviewed this booking', 409);

    const review = await Review.create({
        booking: data.bookingId,
        customer: userId,
        provider: booking.provider,
        service: booking.service,
        reviewerName: booking.customerName,
        rating: data.rating,
        comment: data.comment || '',
        categoryRatings: data.categoryRatings || {},
    });

    // Link review to booking
    booking.review = review._id;
    await booking.save();

    // Update provider aggregate rating
    await recalculateProviderRating(booking.provider);

    // Notify provider
    await createNotification({
        userId: booking.provider,
        type: 'review',
        title: 'New Review',
        body: `${booking.customerName} left a ${data.rating}-star review`,
        link: `/reviews/${review._id}`,
    });

    return review;
};

/**
 * Get reviews for a provider.
 */
export const getProviderReviews = async (providerId, query) => {
    const { page, limit, skip } = paginate(query);
    const [reviews, total] = await Promise.all([
        Review.find({ provider: providerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Review.countDocuments({ provider: providerId }),
    ]);
    return { reviews, page, limit, total };
};

/**
 * Recalculate provider aggregate rating.
 */
const recalculateProviderRating = async (providerId) => {
    const result = await Review.aggregate([
        { $match: { provider: providerId } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (result.length) {
        await ProviderProfile.findOneAndUpdate(
            { user: providerId },
            { rating: Math.round(result[0].avg * 10) / 10, totalReviews: result[0].count }
        );
    }
};
