import { queryClient } from '@/lib/queryClient';
import type { DeckPreview } from '@/types/deck';
import { supabase } from '@/utils/supabase';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export async function createDeck({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<DeckPreview> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/decks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Failed to create deck: ${response.status}`);
  }

  return (await response.json()) as DeckPreview;
}

export function useDecks() {
  return useQuery({
    queryKey: decksQueryKey,
    queryFn: fetchDecks,
  });
}

export function useCreateDeck() {
  return useMutation({
    mutationFn: createDeck,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}
