import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: 'pending_approval' | 'approved_awaiting_payment' | 'paid_confirmed' | 'declined';
  paymentMethod?: string;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending_approval', 'approved_awaiting_payment', 'paid_confirmed', 'declined'], default: 'pending_approval' },
  paymentMethod: { type: String }, // e.g., 'credit_card', 'paypal', 'bank_transfer'
  paymentReference: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
