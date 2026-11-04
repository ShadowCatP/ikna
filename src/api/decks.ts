import type { DeckPreview } from '@/types/deck';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';

const decksQueryKey = ['decks'] as const;

export async function fetchDecks(): Promise<DeckPreview[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/decks', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

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
