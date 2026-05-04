import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  rating?: number;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
