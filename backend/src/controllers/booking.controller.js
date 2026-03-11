import { catchAsync, sendSuccess, sendPaginated } from '../utils/helpers.js';
import * as bookingService from '../services/booking.service.js';

export const create = catchAsync(async (req, res) => {
    const booking = await bookingService.createBooking(req.user._id, req.body);
    sendSuccess(res, booking, 201);
});

export const getMyBookings = catchAsync(async (req, res) => {
    const result = await bookingService.getUserBookings(req.user._id, req.user.role, req.query);
    sendPaginated(res, result.bookings, result.page, result.limit, result.total);
});

export const update = catchAsync(async (req, res) => {
    const booking = await bookingService.updateBookingStatus(
        req.params.id,
        req.user._id,
        req.body
    );
    sendSuccess(res, booking);
});

export const cancel = catchAsync(async (req, res) => {
    const booking = await bookingService.cancelBooking(
        req.params.id,
        req.user._id,
        req.body.reason
    );
    sendSuccess(res, booking);
});
