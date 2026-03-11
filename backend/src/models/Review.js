import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },

        reviewerName: { type: String, required: true },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: { type: String, default: '', maxlength: 2000 },

        // Breakdown
        categoryRatings: {
            quality: { type: Number, min: 1, max: 5 },
            punctuality: { type: Number, min: 1, max: 5 },
            value: { type: Number, min: 1, max: 5 },
            communication: { type: Number, min: 1, max: 5 },
        },

        response: { type: String, default: '' },   // provider reply
        helpful: { type: Number, default: 0 },
    },
    { timestamps: true }
);

reviewSchema.index({ service: 1, createdAt: -1 });
reviewSchema.index({ provider: 1 });
reviewSchema.index({ customer: 1, booking: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
