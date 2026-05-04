import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSetting extends Document {
  key: string;
  value: string;
}

const SiteSettingSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

export default mongoose.models.SiteSetting || mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
