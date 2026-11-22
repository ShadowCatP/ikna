export type Deck = {
  id: string;
  userId?: string;
  title: string;
  description: string | null;
  cardCount: number;
  dueCardCount: number;
  createdAt: string;
  updatedAt: string;
};
