import mongoose from 'mongoose';
import { TRANSACTION_TYPE, PAYMENT_STATUS, PAYMENT_METHODS } from '../config/constants.js';

const transactionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

        type: {
            type: String,
            enum: Object.values(TRANSACTION_TYPE),
            required: true,
        },
        amount: { type: Number, required: true },
        method: {
            type: String,
            enum: PAYMENT_METHODS,
            default: 'card',
        },
        status: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING,
        },

        reference: { type: String, default: '' },   // gateway reference
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ booking: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
