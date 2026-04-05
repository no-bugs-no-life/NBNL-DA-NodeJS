export interface LibraryItem {
  id: string;
  title: string;
  image: string;
  playTime: number; // in hours
  lastPlayed: string;
  type: "game" | "app";
}
