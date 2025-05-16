import { Schema, model, Types } from 'mongoose';

const ExhibitionSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String },
  date:        { type: Date, required: true },
  isLive:      { type: Boolean, default: false },
  artist:      { type: Types.ObjectId, ref: 'User', required: true },
  artworks:    [{ type: Types.ObjectId, ref: 'Artwork' }]
}, { timestamps: true });

export default model('Exhibition', ExhibitionSchema);
