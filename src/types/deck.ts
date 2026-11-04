export type DeckPreview = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  cardCount: number;
  dueCount: number;
  accent: 'lavender' | 'pink' | 'green';
};
