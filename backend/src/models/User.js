import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, ACCOUNT_STATUS } from '../config/constants.js';

const addressSchema = new mongoose.Schema({
    label: { type: String, default: 'Home' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
}, { _id: true });

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: 2,
            maxlength: 60,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'Please provide a valid email'],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.CUSTOMER,
        },
        status: {
            type: String,
            enum: Object.values(ACCOUNT_STATUS),
            default: ACCOUNT_STATUS.ACTIVE,
        },
        phone: { type: String, default: '' },
        avatar: { type: String, default: '' },
        addresses: [addressSchema],

        // Wallet
        walletBalance: { type: Number, default: 0 },

        // Notification prefs
        notificationPrefs: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
        },

        // Refresh token (stored hashed)
        refreshToken: { type: String, select: false },

        // MFA placeholder
        mfaEnabled: { type: Boolean, default: false },
        mfaSecret: { type: String, select: false, default: '' },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ── Hooks ───────────────────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

// ── Methods ─────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.passwordHash);
};

// ── Virtuals ────────────────────────────
userSchema.virtual('firstName').get(function () {
    return this.name?.split(' ')[0] || '';
});

// ── Indexes ─────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });

const User = mongoose.model('User', userSchema);
export default User;
