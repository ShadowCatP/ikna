import { apiFetch } from '@/client/api';
import { decksQueryKey } from '@/client/decks';
import { queryClient } from '@/lib/queryClient';
import type { Card } from '@/types/card';
import { useMutation, useQuery } from '@tanstack/react-query';

const cardsQueryKey = ['cards'] as const;

export async function fetchCards(deckId: string): Promise<Card[]> {
  return apiFetch<Card[]>(`/api/decks/${deckId}/cards`);
}

export function useCards(deckId: string) {
  return useQuery({
    queryKey: [...cardsQueryKey, deckId],
    queryFn: () => fetchCards(deckId),
    enabled: Boolean(deckId),
  });
}

export async function createCard({
  deckId,
  front,
  back,
}: {
  deckId: string;
  front: string;
  back: string;
}): Promise<Card> {
  return apiFetch<Card>('/api/cards', {
    method: 'POST',
    body: {
      deckId,
      frontContent: front,
      backContent: back,
    },
  });
}

export function useCreateCard() {
  return useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: decksQueryKey }),
        queryClient.invalidateQueries({ queryKey: cardsQueryKey }),
      ]);
    },
  });
}
