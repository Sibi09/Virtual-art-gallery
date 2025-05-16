import { Schema, model, Types } from 'mongoose';

const TransactionSchema = new Schema({
  artwork:   { type: Types.ObjectId, ref: 'Artwork', required: true },
  collector: { type: Types.ObjectId, ref: 'User', required: true },
  price:     { type: Number, required: true },
  date:      { type: Date, default: Date.now },
});

export default model('Transaction', TransactionSchema);