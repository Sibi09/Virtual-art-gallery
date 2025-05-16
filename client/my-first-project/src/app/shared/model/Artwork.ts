export interface Artwork {
    _id?: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    artist?: {
      _id: string;
      username: string;
    };
  }
  