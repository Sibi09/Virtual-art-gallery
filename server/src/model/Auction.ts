import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const AuctionSchema = new mongoose.Schema({
  artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startingPrice: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  currentBidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bidHistory: [BidSchema],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'live', 'ended'], default: 'upcoming' }
});

export default mongoose.model('Auction', AuctionSchema);