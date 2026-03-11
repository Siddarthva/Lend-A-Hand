import { catchAsync, sendSuccess, sendPaginated } from '../utils/helpers.js';
import * as paymentService from '../services/payment.service.js';

export const initiate = catchAsync(async (req, res) => {
    const txn = await paymentService.initiatePayment(req.user._id, req.body);
    sendSuccess(res, txn, 201);
});

export const refund = catchAsync(async (req, res) => {
    const txn = await paymentService.processRefund(req.user._id, req.body);
    sendSuccess(res, txn);
});

export const getMyTransactions = catchAsync(async (req, res) => {
    const result = await paymentService.getUserTransactions(req.user._id, req.query);
    sendPaginated(res, result.transactions, result.page, result.limit, result.total);
});
