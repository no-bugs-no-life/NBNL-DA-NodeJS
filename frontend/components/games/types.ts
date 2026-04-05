export interface GameItem {
  _id: string;
  slug?: string;
  name: string;
  price: number;
  ratingScore?: number;
  iconUrl?: string;
  tags?: string[];
}
