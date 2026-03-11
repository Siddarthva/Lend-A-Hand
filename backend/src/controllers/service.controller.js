import { catchAsync, sendSuccess, sendPaginated, paginate, AppError } from '../utils/helpers.js';
import Service from '../models/Service.js';

export const getServices = catchAsync(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = { active: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
        filter.$text = { $search: req.query.search };
    }

    const [services, total] = await Promise.all([
        Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Service.countDocuments(filter),
    ]);

    sendPaginated(res, services, page, limit, total);
});

export const createService = catchAsync(async (req, res) => {
    const service = await Service.create(req.body);
    sendSuccess(res, service, 201);
});

export const updateService = catchAsync(async (req, res) => {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!service) throw new AppError('Service not found', 404);
    sendSuccess(res, service);
});
