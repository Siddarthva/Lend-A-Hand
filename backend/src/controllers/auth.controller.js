import { catchAsync, sendSuccess } from '../utils/helpers.js';
import * as authService from '../services/auth.service.js';

export const register = catchAsync(async (req, res) => {
    const result = await authService.registerUser(req.body);
    sendSuccess(res, result, 201);
});

export const login = catchAsync(async (req, res) => {
    const result = await authService.loginUser(req.body);
    sendSuccess(res, result);
});

export const refresh = catchAsync(async (req, res) => {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    sendSuccess(res, result);
});

export const logout = catchAsync(async (req, res) => {
    await authService.logoutUser(req.user._id);
    sendSuccess(res, { message: 'Logged out successfully' });
});
