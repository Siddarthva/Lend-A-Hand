import { catchAsync, sendSuccess, sendPaginated } from '../utils/helpers.js';
import * as reviewService from '../services/review.service.js';

export const create = catchAsync(async (req, res) => {
    const review = await reviewService.submitReview(req.user._id, req.body);
    sendSuccess(res, review, 201);
});

export const getProviderReviews = catchAsync(async (req, res) => {
    const result = await reviewService.getProviderReviews(req.params.id, req.query);
    sendPaginated(res, result.reviews, result.page, result.limit, result.total);
});
