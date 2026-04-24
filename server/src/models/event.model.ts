import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, ref: 'Ticket' },
    type: { type: String, enum: ['created', 'reply', 'status_change', 'reassigned'], required: true },
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null for customers
  },
  { timestamps: true }
);

eventSchema.index({ ticketId: 1, createdAt: 1 });

export const Event = mongoose.model('Event', eventSchema);
