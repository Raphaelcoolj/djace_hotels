import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  description: string;
  roomClass: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
}

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  roomClass: { type: String, default: "Standard" },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 2 },
  amenities: [{ type: String }],
  images: [{ type: String }], // Cloudinary URLs
  isAvailable: { type: Boolean, default: true },
});

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
