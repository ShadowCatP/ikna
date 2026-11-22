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

export const isSyncing$ = observable(false);

export function markSyncedNow() {
  syncMeta$.lastSyncedAt.set(new Date().toISOString());
}

export async function syncAll(userId?: string) {
  if (!userId || isSyncing$.peek()) return;

  isSyncing$.set(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 5600));

    const observables = [decks$(), ...getLocalDeckCards$()];

    await Promise.all(observables.map((obs$) => syncState(obs$).sync()));

    const hasError = observables.some((obs$) =>
      Boolean(syncState(obs$).error.peek())
    );
    if (!hasError) markSyncedNow();
  } finally {
    isSyncing$.set(false);
  }
}

export function useGlobalSyncStatus() {
  const lastSyncedAt = useValue(() => syncMeta$.lastSyncedAt.get());
  const isSyncing = useValue(() => isSyncing$.get());

  const status = useValue(() => {
    const observables = [decks$(), ...getLocalDeckCards$()];

    let hasError = false;
    let hasUnsyncedChanges = false;

    for (const obs$ of observables) {
      const state = syncState(obs$).get();

      if (state.error) hasError = true;
      const pending = syncState(obs$).getPendingChanges?.();
      if (pending && Object.keys(pending).length > 0) hasUnsyncedChanges = true;
    }

    return { hasError, hasUnsyncedChanges, isSyncing };
  });

  return {
    lastSyncedAt,
    ...status,
  };
}
