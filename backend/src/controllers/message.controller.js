import { catchAsync, sendSuccess, sendPaginated } from '../utils/helpers.js';
import * as messageService from '../services/message.service.js';

export const getThreads = catchAsync(async (req, res) => {
    const threads = await messageService.getUserThreads(req.user._id.toString());
    sendSuccess(res, threads);
});

export const createThread = catchAsync(async (req, res) => {
    const thread = await messageService.findOrCreateThread(
        req.user._id.toString(),
        req.body.receiverId,
        req.body.bookingId
    );
    sendSuccess(res, thread, 201);
});

export const getMessages = catchAsync(async (req, res) => {
    const result = await messageService.getThreadMessages(
        req.params.id,
        req.user._id.toString(),
        req.query
    );
    sendPaginated(res, result.messages, result.page, result.limit, result.total);
});

export const sendMessage = catchAsync(async (req, res) => {
    const message = await messageService.sendMessage(req.user._id.toString(), req.body);
    sendSuccess(res, message, 201);
});
