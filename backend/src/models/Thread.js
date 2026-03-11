import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema(
    {
        participants: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        ],
        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
        lastMessageAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

threadSchema.index({ participants: 1 });
threadSchema.index({ lastMessageAt: -1 });

const Thread = mongoose.model('Thread', threadSchema);
export default Thread;
