import { ApiError, apiFetch } from '@/client/api';
import { isOnline$ } from '@/lib/network';
import type { Deck } from '@/types/deck';
import { Observable, observable, syncState } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import { randomUUID } from 'expo-crypto';

type DecksMap = Record<string, Deck>;

let decksObservable: Observable<DecksMap> | null = null;

export function decks$() {
  if (decksObservable) return decksObservable;

  decksObservable = observable<DecksMap>(
    syncedCrud({
      as: 'object',
      initial: {},
      mode: 'merge',
      persist: {
        name: 'decks',
        retrySync: true,
      },
      waitFor: isOnline$,
      list: async () => {
        return apiFetch<Deck[]>('/api/decks');
      },
      create: async (input) => {
        return apiFetch<Deck>('/api/decks', {
          method: 'POST',
          body: {
            id: input.id,
            title: input.title,
            description: input.description,
          },
        });
      },
      update: async (input) => {
        return apiFetch<Deck>(`/api/decks/${input.id}`, {
          method: 'PATCH',
          body: {
            title: input.title,
            description: input.description,
          },
        });
      },
      delete: async (input) => {
        await apiFetch<{ success: boolean }>(`/api/decks/${input.id}`, {
          method: 'DELETE',
        });
      },
    })
  );

  return decksObservable;
}
export function useDecks() {
  const decks = useValue(() => Object.values(decks$().get()));
  const decksSync = useValue(() => syncState(decks$()).get());

  return {
    decks,
    isLoading: !decksSync.isPersistLoaded || !decksSync.isLoaded,
    isError: Boolean(decksSync.error),
    error: decksSync.error,
    refetch: () => {
      void syncState(decks$()).sync();
    },
  };
}

export function useDeck(id: string) {
  const deck$ = id ? decks$()[id] : undefined;
  const deck = useValue(() => deck$?.get());
  const decksSync = useValue(() => syncState(decks$()).get());

  return {
    deck,
    isLoading: id ? !decksSync.isPersistLoaded || !decksSync.isLoaded : false,
    isError: Boolean(decksSync.error),
    error: decksSync.error,
    refetch: () => {
      if (id) void syncState(decks$()).sync();
    },
  };
}

export async function createDeck({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<Deck> {
  const timestamp = new Date().toISOString();
  const id = randomUUID();

  const deck: Deck = {
    id,
    title,
    description,
    cardCount: 0,
    dueCardCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  decks$()[id].set(deck);
  return deck;
}

export async function updateDeck({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}): Promise<Deck> {
  const deck$ = decks$()[id];
  const existing = deck$.peek();

  if (!existing) throw new ApiError('Deck not found', 404);

  const updated: Deck = {
    ...existing,
    title,
    description,
    updatedAt: new Date().toISOString(),
  };

  deck$.set(updated);
  return updated;
}

export async function deleteDeck(id: string): Promise<void> {
  const deck$ = decks$()[id];
  if (!decks$().peek()) return;
  deck$.delete();
}

export function adjustDeckCardCounts(deckId: string, delta: number): void {
  const deck$ = decks$()[deckId];
  const deck = deck$.peek();

  if (!deck) return;

  deck$.assign({
    cardCount: Math.max(0, deck.cardCount + delta),
    dueCardCount: Math.max(0, deck.dueCardCount + delta),
  });
}
