import { apiFetch } from '@/client/api';
import { decksQueryKey } from '@/client/decks';
import { queryClient } from '@/lib/queryClient';
import type { Card } from '@/types/card';
import { useMutation, useQuery } from '@tanstack/react-query';

const cardsQueryRootKey = ['cards'] as const;

export function cardsQueryKey(deckId: string) {
  return [...cardsQueryRootKey, deckId] as const;
}

export function cardQueryKey(cardId: string) {
  return [...cardsQueryRootKey, 'detail', cardId] as const;
}

export async function fetchCards(deckId: string): Promise<Card[]> {
  return apiFetch<Card[]>(`/api/decks/${deckId}/cards`);
}

export function useCards(deckId: string) {
  return useQuery({
    queryKey: cardsQueryKey(deckId),
    queryFn: () => fetchCards(deckId),
    enabled: Boolean(deckId),
  });
}

export async function fetchCard(cardId: string): Promise<Card> {
  return apiFetch<Card>(`/api/cards/${cardId}`);
}

export function useCard(cardId: string) {
  return useQuery({
    queryKey: cardQueryKey(cardId),
    queryFn: () => fetchCard(cardId),
    enabled: Boolean(cardId),
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
        queryClient.invalidateQueries({ queryKey: cardsQueryRootKey }),
      ]);
    },
  });
}

export async function updateCard({
  id,
  front,
  back,
}: {
  id: string;
  front: string;
  back: string;
}): Promise<Card> {
  return apiFetch<Card>(`/api/cards/${id}`, {
    method: 'PATCH',
    body: {
      frontContent: front,
      backContent: back,
    },
  });
}

export function useUpdateCard() {
  return useMutation({
    mutationFn: updateCard,
    onSuccess: (_card, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: cardQueryKey(variables.id) }),
        queryClient.invalidateQueries({ queryKey: cardsQueryRootKey }),
        queryClient.invalidateQueries({ queryKey: decksQueryKey }),
      ]);
    },
  });
}

export async function deleteCard({ id }: { id: string }): Promise<void> {
  await apiFetch<{ success: boolean }>(`/api/cards/${id}`, {
    method: 'DELETE',
  });
}

export function useDeleteCard() {
  return useMutation({
    mutationFn: deleteCard,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: cardsQueryRootKey });
      const previousCards = queryClient.getQueriesData<Card[]>({
        queryKey: cardsQueryRootKey,
      });

      previousCards.forEach(([queryKey, cards]) => {
        queryClient.setQueryData<Card[]>(
          queryKey,
          cards?.filter((card) => card.id !== id)
        );
      });

      return { previousCards };
    },
    onError: (_error, _variables, context) => {
      context?.previousCards.forEach(([queryKey, cards]) => {
        queryClient.setQueryData(queryKey, cards);
      });
    },
    onSettled: (_data, _error, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: decksQueryKey }),
        queryClient.invalidateQueries({ queryKey: cardsQueryRootKey }),
        queryClient.removeQueries({ queryKey: cardQueryKey(variables.id) }),
      ]);
    },
  });
}
