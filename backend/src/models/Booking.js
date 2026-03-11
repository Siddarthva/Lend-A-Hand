import mongoose from 'mongoose';
import { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../config/constants.js';

const bookingSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },

        // Snapshots (immutable after creation)
        serviceTitle: { type: String, required: true },
        providerName: { type: String, required: true },
        customerName: { type: String, required: true },

        // Schedule
        scheduledStart: { type: Date, required: true },
        scheduledEnd: { type: Date },
        address: { type: String, required: true },
        notes: { type: String, default: '', maxlength: 1000 },

        // Status
        status: {
            type: String,
            enum: Object.values(BOOKING_STATUS),
            default: BOOKING_STATUS.PENDING,
        },
        statusHistory: [
            {
                status: String,
                timestamp: { type: Date, default: Date.now },
                note: { type: String, default: '' },
            },
        ],

        // Pricing
        amount: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },

        paymentMethod: {
            type: String,
            enum: PAYMENT_METHODS,
            default: 'card',
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING,
        },
        transactionId: { type: String, default: '' },

        // Linked review
        review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },

        cancelReason: { type: String, default: '' },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ scheduledStart: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
