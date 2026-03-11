import mongoose from 'mongoose';
import { CATEGORIES } from '../config/constants.js';

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true,
            maxlength: 120,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: 2000,
        },
        category: {
            type: String,
            required: true,
            enum: CATEGORIES,
        },
        basePrice: {
            type: Number,
            required: [true, 'Base price is required'],
            min: 0,
        },
        duration: {
            type: Number,      // estimated minutes
            default: 60,
        },
        tags: [String],
        image: { type: String, default: '' },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

serviceSchema.index({ category: 1, active: 1 });
serviceSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
