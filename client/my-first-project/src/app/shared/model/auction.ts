import { Artwork } from './Artwork';
import { User } from './User';

export interface Bid {
  userId: User;
  amount: number;
  timestamp: string;
}

export interface Auction {
  _id?: string;
  artworkId: Artwork;            // ← fontos, hogy ne csak string
  artistId: User;
  startingPrice: number;
  currentBid: number;
  currentBidderId?: User;
  bidHistory: Bid[];
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'ended';
}
