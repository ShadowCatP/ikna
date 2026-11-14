import { apiFetch } from '@/client/api';
import { queryClient } from '@/lib/queryClient';
import type { DeckPreview } from '@/types/deck';
import { useMutation, useQuery } from '@tanstack/react-query';

export const decksQueryKey = ['decks'] as const;

export async function fetchDecks(): Promise<DeckPreview[]> {
  return apiFetch<DeckPreview[]>('/api/decks');
}

export function fetchDeck(id: string): Promise<DeckPreview> {
  return apiFetch<DeckPreview>(`/api/decks/${id}`);
}

export async function createDeck({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<DeckPreview> {
  return apiFetch<DeckPreview>('/api/decks', {
    method: 'POST',
    body: { title, description },
  });
}

export async function updateDeck({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}): Promise<DeckPreview> {
  return apiFetch<DeckPreview>(`/api/decks/${id}`, {
    method: 'PATCH',
    body: { title, description },
  });
}

export async function deleteDeck(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/api/decks/${id}`, {
    method: 'DELETE',
  });
}

export function useDecks() {
  return useQuery({
    queryKey: decksQueryKey,
    queryFn: fetchDecks,
  });
}

export function useDeck(id: string) {
  return useQuery({
    queryKey: [...decksQueryKey, id],
    queryFn: () => fetchDeck(id),
    enabled: Boolean(id),
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

export function useUpdateDeck() {
  return useMutation({
    mutationFn: updateDeck,
    onSuccess: (_deck, variables) => {
      return queryClient.invalidateQueries({
        queryKey: [...decksQueryKey, variables.id],
      });
    },
  });
}

export function useDeleteDeck() {
  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: [...decksQueryKey, id] });
      return queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}
