export interface Artwork {
    _id?: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    availableForImmediatePurchase?: boolean;
    artist?: {
      _id: string;
      username: string;
    };
  }
  