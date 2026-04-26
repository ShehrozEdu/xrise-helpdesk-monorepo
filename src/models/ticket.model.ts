import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

ticketSchema.index({ status: 1, priority: 1, assigneeId: 1 });
ticketSchema.index({ email: 1, ticketId: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ subject: 'text', body: 'text' });

export const Ticket = mongoose.model('Ticket', ticketSchema);
