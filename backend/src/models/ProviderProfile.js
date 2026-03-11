import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema({
    day: { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], required: true },
    start: { type: String, required: true },  // "09:00"
    end: { type: String, required: true },  // "17:00"
}, { _id: false });

const providerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        bio: { type: String, default: '', maxlength: 1000 },
        experience: { type: Number, default: 0 },   // years
        servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],

        // Rating aggregates
        rating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        totalBookings: { type: Number, default: 0 },

        // Availability
        availability: [availabilitySlotSchema],

        // Verification
        verified: { type: Boolean, default: false },
        verifiedAt: { type: Date },
        identityDoc: { type: String, default: '' },   // URL placeholder

        // Portfolio
        portfolioImages: [String],

        // GeoJSON location
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],   // [lng, lat]
                default: [0, 0],
            },
        },
    },
    { timestamps: true }
);

providerProfileSchema.index({ location: '2dsphere' });
providerProfileSchema.index({ user: 1 });
providerProfileSchema.index({ rating: -1 });

const ProviderProfile = mongoose.model('ProviderProfile', providerProfileSchema);
export default ProviderProfile;
