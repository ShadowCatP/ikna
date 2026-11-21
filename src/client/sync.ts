import { observable, syncState } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { synced } from '@legendapp/state/sync';
import { getLocalDeckCards$ } from './cards';
import { decks$ } from './decks';

type SyncMeta = { lastSyncedAt: string | null };

export const syncMeta$ = observable<SyncMeta>(
  synced({
    initial: { lastSyncedAt: null },
    persist: {
      name: 'sync:meta',
    },
  })
);

export function markSyncedNow() {
  syncMeta$.lastSyncedAt.set(new Date().toISOString());
}

export async function syncAll(userId?: string) {
  if (!userId) return;

  const observables = [decks$(), ...getLocalDeckCards$()];

  await Promise.all(observables.map((obs$) => syncState(obs$).sync()));

  const hasError = observables.some((obs$) =>
    Boolean(syncState(obs$).error.peek())
  );
  if (!hasError) markSyncedNow();
}

export function useGlobalSyncStatus(enabled = true) {
  const lastSyncedAt = useValue(() => syncMeta$.lastSyncedAt.get());

  const status = useValue(() => {
    if (!enabled) return { hasError: false, isPending: false };

    const observables = [decks$(), ...getLocalDeckCards$()];

    let hasError = false;
    let isPending = false;

    for (const obs$ of observables) {
      const state = syncState(obs$).get();
      if (state.error) hasError = true;
      const pending = syncState(obs$).getPendingChanges?.();
      if (pending && Object.keys(pending).length > 0) isPending = true;
    }

    return { hasError, isPending };
  });

  return {
    lastSyncedAt,
    ...status,
  };
}
