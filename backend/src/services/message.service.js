import Thread from '../models/Thread.js';
import Message from '../models/Message.js';
import { AppError, paginate } from '../utils/helpers.js';

/**
 * Get all threads for a user.
 */
export const getUserThreads = async (userId) => {
    const threads = await Thread.find({ participants: userId })
        .populate('participants', 'name avatar')
        .populate('lastMessage', 'content createdAt')
        .sort({ lastMessageAt: -1 });
    return threads;
};

/**
 * Create or find existing thread between two users.
 */
export const findOrCreateThread = async (userId, receiverId, bookingId) => {
    let thread = await Thread.findOne({
        participants: { $all: [userId, receiverId] },
    });

    if (!thread) {
        thread = await Thread.create({
            participants: [userId, receiverId],
            booking: bookingId || null,
        });
    }

    return thread;
};

/**
 * Get messages in a thread (paginated).
 */
export const getThreadMessages = async (threadId, userId, query) => {
    const thread = await Thread.findById(threadId);
    if (!thread) throw new AppError('Thread not found', 404);
    if (!thread.participants.map(String).includes(userId)) {
        throw new AppError('Not authorised', 403);
    }

    const { page, limit, skip } = paginate(query);
    const [messages, total] = await Promise.all([
        Message.find({ thread: threadId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Message.countDocuments({ thread: threadId }),
    ]);

    // Mark received messages as read
    await Message.updateMany(
        { thread: threadId, receiver: userId, status: { $ne: 'read' } },
        { status: 'read' }
    );

    return { messages: messages.reverse(), page, limit, total };
};

/**
 * Send a message.
 */
export const sendMessage = async (senderId, { threadId, receiverId, content }) => {
    let thread;
    if (threadId) {
        thread = await Thread.findById(threadId);
        if (!thread) throw new AppError('Thread not found', 404);
    } else {
        thread = await findOrCreateThread(senderId, receiverId);
    }

    const receiver = thread.participants.find((p) => p.toString() !== senderId);

    const message = await Message.create({
        thread: thread._id,
        sender: senderId,
        receiver: receiver,
        content,
    });

    thread.lastMessage = message._id;
    thread.lastMessageAt = message.createdAt;
    await thread.save();

    return message;
};
