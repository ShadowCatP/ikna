import { useDeletionStore } from '@/lib/deletionStore';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { UndoSnackbar } from './UndoSnackbar';

export function SnackbarProvider() {
  const entries = useDeletionStore((state) => state.entries);
  const undoLast = useDeletionStore((state) => state.undoLast);
  const commitAll = useDeletionStore((state) => state.commitAll);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') commitAll();
    });

    return () => sub.remove();
  }, [commitAll]);

  const fresh = entries.filter((e) => e.status === 'fresh');
  const latest = fresh[fresh.length - 1];

  if (!latest) return null;

  return (
    <UndoSnackbar
      message={latest.message}
      extraCount={fresh.length - 1}
      onUndo={undoLast}
    />
  );
}
