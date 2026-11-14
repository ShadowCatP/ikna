import { apiFetch } from '@/client/api';
import { decksQueryKey } from '@/client/decks';
import { queryClient } from '@/lib/queryClient';
import type { Card } from '@/types/card';
import { useMutation } from '@tanstack/react-query';

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
      return queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}
