import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export const generateTicketId = async (): Promise<string> => {
  const doc = await Counter.findByIdAndUpdate(
    'ticketId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  
  // Pad with leading zeros to 6 digits, e.g. TKT-000001
  const paddedSeq = doc.seq.toString().padStart(6, '0');
  return `TKT-${paddedSeq}`;
};
