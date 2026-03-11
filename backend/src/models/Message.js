import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, maxlength: 5000 },
        attachments: [String],
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent',
        },
    },
    { timestamps: true }
);

messageSchema.index({ thread: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
