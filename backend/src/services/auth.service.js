import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, AppError } from '../utils/helpers.js';
import bcrypt from 'bcryptjs';

export const registerUser = async ({ name, email, password, role = 'customer' }) => {
    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already registered', 409);

    const user = await User.create({ name, email, passwordHash: password, role });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store hashed refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save({ validateBeforeSave: false });

    return {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw new AppError('Invalid email or password', 401);

    if (user.status !== 'active') throw new AppError('Account is suspended', 403);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save({ validateBeforeSave: false });

    return {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
    };
};

export const refreshAccessToken = async (oldRefreshToken) => {
    const decoded = verifyRefreshToken(oldRefreshToken);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !user.refreshToken) throw new AppError('Invalid refresh token', 401);

    const valid = await bcrypt.compare(oldRefreshToken, user.refreshToken);
    if (!valid) throw new AppError('Invalid refresh token', 401);

    // Rotate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};
