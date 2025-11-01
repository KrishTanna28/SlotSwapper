import mongoose from "mongoose";

const { Schema } = mongoose;

const EventSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: String,
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['BUSY','SWAPPABLE','SWAP_PENDING'], index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
EventSchema.index({ startTime: 1, endTime: 1 });

export default mongoose.model("Event", EventSchema);