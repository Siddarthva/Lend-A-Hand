import { catchAsync, sendSuccess, sendPaginated, paginate, AppError } from '../utils/helpers.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';
import Service from '../models/Service.js';

export const getUsers = catchAsync(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;

    const [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter),
    ]);

    sendPaginated(res, users, page, limit, total);
});

export const updateUserStatus = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
    );
    if (!user) throw new AppError('User not found', 404);
    sendSuccess(res, user);
});

export const getAnalytics = catchAsync(async (req, res) => {
    const [
        totalUsers,
        totalProviders,
        totalBookings,
        totalRevenue,
        totalServices,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'provider' }),
        Booking.countDocuments(),
        Transaction.aggregate([
            { $match: { type: 'payment', status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Service.countDocuments({ active: true }),
    ]);

    sendSuccess(res, {
        totalUsers,
        totalProviders,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalServices,
    });
});
