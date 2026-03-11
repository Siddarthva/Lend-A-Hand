import { catchAsync, sendSuccess, sendPaginated } from '../utils/helpers.js';
import * as notifService from '../services/notification.service.js';

export const getNotifications = catchAsync(async (req, res) => {
    const result = await notifService.getUserNotifications(req.user._id, req.query);
    sendPaginated(res, result.notifications, result.page, result.limit, result.total);
});

export const markRead = catchAsync(async (req, res) => {
    const notif = await notifService.markAsRead(req.params.id, req.user._id);
    sendSuccess(res, notif);
});

export const markAllRead = catchAsync(async (req, res) => {
    await notifService.markAllAsRead(req.user._id);
    sendSuccess(res, { message: 'All notifications marked as read' });
});
