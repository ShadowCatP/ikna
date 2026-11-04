import type { DeckPreview } from '@/types/deck';
import { useQuery } from '@tanstack/react-query';

const decksQueryKey = ['decks'] as const;

export async function fetchDecks(): Promise<DeckPreview[]> {
  const response = await fetch('/api/decks');

  if (!response.ok) {
    throw new Error(`Failed to fetch decks: ${response.status}`);
  }

  return (await response.json()) as DeckPreview[];
}

export function useDecks() {
  return useQuery({
    queryKey: decksQueryKey,
    queryFn: fetchDecks,
  });
}
