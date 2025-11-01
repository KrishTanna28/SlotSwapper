import mongoose from "mongoose";

const { Schema } = mongoose;

const SwapRequestSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  responder: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  requesterEvent: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  responderEvent: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED','CANCELLED'], default: 'PENDING', index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("SwapRequest", SwapRequestSchema);