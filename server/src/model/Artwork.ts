import { Schema, model, Types } from 'mongoose';

const ArtworkSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  imageUrl:    { type: String },
  artist:      { type: Types.ObjectId, ref: 'User', required: true },

  availableForImmediatePurchase: { type: Boolean, default: false },
}, { timestamps: true });

export default model('Artwork', ArtworkSchema);