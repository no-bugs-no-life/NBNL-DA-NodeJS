export interface GameItem {
  id: string;
  title: string;
  price: string | number;
  rating: number;
  coverSrc: string;
  tags?: string[];
}
