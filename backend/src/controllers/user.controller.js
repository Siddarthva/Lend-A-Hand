import { catchAsync, sendSuccess, AppError } from '../utils/helpers.js';
import User from '../models/User.js';

export const getMe = catchAsync(async (req, res) => {
    sendSuccess(res, req.user);
});

export const updateMe = catchAsync(async (req, res) => {
    const allowed = ['name', 'phone', 'avatar', 'bio', 'addresses', 'notificationPrefs', 'darkMode'];
    const updates = {};
    allowed.forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    });

    sendSuccess(res, user);
});

export const getUserById = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    sendSuccess(res, user);
});
