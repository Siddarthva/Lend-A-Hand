import { catchAsync, sendSuccess, paginate, sendPaginated, AppError } from '../utils/helpers.js';
import ProviderProfile from '../models/ProviderProfile.js';
import User from '../models/User.js';

export const getProviders = catchAsync(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);

    const filter = {};
    if (req.query.verified === 'true') filter.verified = true;

    const [providers, total] = await Promise.all([
        ProviderProfile.find(filter)
            .populate('user', 'name avatar email phone')
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit),
        ProviderProfile.countDocuments(filter),
    ]);

    sendPaginated(res, providers, page, limit, total);
});

export const getProviderById = catchAsync(async (req, res) => {
    const profile = await ProviderProfile.findOne({ user: req.params.id })
        .populate('user', 'name avatar email phone');
    if (!profile) throw new AppError('Provider not found', 404);
    sendSuccess(res, profile);
});

export const createProfile = catchAsync(async (req, res) => {
    const existing = await ProviderProfile.findOne({ user: req.user._id });
    if (existing) throw new AppError('Profile already exists', 409);

    const profile = await ProviderProfile.create({
        user: req.user._id,
        bio: req.body.bio || '',
        experience: req.body.experience || 0,
        availability: req.body.availability || [],
        location: req.body.location || { type: 'Point', coordinates: [0, 0] },
    });

    sendSuccess(res, profile, 201);
});

export const updateProfile = catchAsync(async (req, res) => {
    const allowed = ['bio', 'experience', 'availability', 'portfolioImages', 'location'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const profile = await ProviderProfile.findOneAndUpdate(
        { user: req.user._id },
        updates,
        { new: true, runValidators: true }
    );
    if (!profile) throw new AppError('Profile not found. Create one first.', 404);

    sendSuccess(res, profile);
});
