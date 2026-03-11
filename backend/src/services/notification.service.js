import Notification from '../models/Notification.js';
import { paginate } from '../utils/helpers.js';

/**
 * Create a notification (used internally by other services).
 */
export const createNotification = async ({ userId, type, title, body, link, metadata }) => {
    return Notification.create({
        user: userId,
        type,
        title,
        body,
        link: link || '',
        metadata: metadata || {},
    });
};

/**
 * Get notifications for a user.
 */
export const getUserNotifications = async (userId, query) => {
    const { page, limit, skip } = paginate(query);
    const filter = { user: userId };

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification.countDocuments(filter),
        Notification.countDocuments({ ...filter, read: false }),
    ]);

    return { notifications, page, limit, total, unreadCount };
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (notificationId, userId) => {
    const notif = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { read: true },
        { new: true }
    );
    return notif;
};

/**
 * Mark all notifications as read.
 */
export const markAllAsRead = async (userId) => {
    await Notification.updateMany({ user: userId, read: false }, { read: true });
};
