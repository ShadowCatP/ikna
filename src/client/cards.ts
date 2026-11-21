import { apiFetch } from '@/client/api';
import { adjustDeckCardCounts } from '@/client/decks';
import type { Card } from '@/types/card';
import { observable, Observable, syncState } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import { randomUUID } from 'expo-crypto';

type CardsMap = Record<string, Card>;

const deckCardsObservable = new Map<string, Observable<CardsMap>>();

export function getDeckCards$(deckId: string): Observable<CardsMap> {
  const existing = deckCardsObservable.get(deckId);

  if (existing) return existing;

  const cards$ = observable<CardsMap>(
    syncedCrud({
      as: 'object',
      initial: {},
      mode: 'merge',
      persist: {
        name: `cards:${deckId}`,
        retrySync: true,
      },
      list: async () => {
        return apiFetch<Card[]>(`/api/decks/${deckId}/cards`);
      },
      create: async (input) => {
        return apiFetch<Card>('/api/cards', {
          method: 'POST',
          body: {
            id: input.id,
            deckId: input.deckId,
            frontContent: input.frontContent,
            backContent: input.backContent,
          },
        });
      },
      update: async (input) => {
        return apiFetch<Card>(`/api/cards/${input.id}`, {
          method: 'PATCH',
          body: {
            frontContent: input.frontContent,
            backContent: input.backContent,
          },
        });
      },
      delete: async (input) => {
        await apiFetch(`/api/cards/${input.id}`, { method: 'DELETE' });
      },
    })
  );

  deckCardsObservable.set(deckId, cards$);
  return cards$;
}

export function useDeckCards(deckId: string) {
  const cards$ = deckId ? getDeckCards$(deckId) : undefined;
  const cards = useValue(() => Object.values(cards$?.get() ?? {}));
  const cardsSync = useValue(() =>
    cards$ ? syncState(cards$).get() : undefined
  );

  return {
    cards,
    isLoading: cardsSync
      ? !cardsSync.isPersistLoaded && !cardsSync.isLoaded
      : true,
    isError: Boolean(cardsSync?.error),
    error: cardsSync?.error,
    refetch: () => {
      if (cards$) void syncState(cards$).sync();
    },
  };
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
  const timestamp = new Date().toISOString();
  const card: Card = {
    id: randomUUID(),
    deckId,
    frontContent: front,
    backContent: back,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  getDeckCards$(deckId)[card.id].set(card);
  adjustDeckCardCounts(deckId, 1);
  return card;
}

export async function updateCard({
  id,
  deckId,
  front,
  back,
}: {
  id: string;
  deckId: string;
  front: string;
  back: string;
}): Promise<Card> {
  const card$ = getDeckCards$(deckId)[id];
  const existing = card$.peek();

  if (!existing) {
    throw new Error('Card not found');
  }

  const updated: Card = {
    ...existing,
    frontContent: front,
    backContent: back,
    updatedAt: new Date().toISOString(),
  };

  card$.set(updated);
  return updated;
}

export async function deleteCard({
  id,
  deckId,
}: {
  id: string;
  deckId: string;
}): Promise<void> {
  const card$ = getDeckCards$(deckId)[id];
  if (!card$.peek()) return;
  card$.delete();
  adjustDeckCardCounts(deckId, -1);
}

export function useCard(deckId: string, cardId: string) {
  const cards$ = deckId ? getDeckCards$(deckId) : undefined;
  const card$ = cards$ && cardId ? cards$[cardId] : undefined;
  const card = useValue(() => card$?.get());
  const cardsSync = useValue(() =>
    cards$ ? syncState(cards$).get() : undefined
  );

  return {
    card,
    isLoading: cardsSync
      ? !cardsSync.isPersistLoaded || !cardsSync.isLoaded
      : true,
    isError: Boolean(cardsSync?.error),
    error: cardsSync?.error,
    refetch: () => {
      if (cards$) void syncState(cards$).sync();
    },
  };
}
