import { useMemo } from 'react';
import { create } from 'zustand';

const UNDO_WINDOW_MS = 2500;

export type PendingDeletion<TData = unknown> = {
  key: string;
  kind: string;
  id: string;
  message: string;
  data: TData;
  status: 'fresh' | 'committing';
};

type DeletionState = {
  entries: PendingDeletion[];
  undo: (key: string) => void;
  undoLast: () => void;
  commitAll: () => void;
};

type Job = {
  timer: ReturnType<typeof setTimeout>;
  commit: () => Promise<unknown>;
  onError?: (error: unknown) => void;
};
const jobs = new Map<string, Job>();

export const useDeletionStore = create<DeletionState>()((set, get) => ({
  entries: [],
  undo: (key) => {
    const job = jobs.get(key);
    if (!job) return;
    clearTimeout(job.timer);
    jobs.delete(key);
    removeEntry(key);
  },
  undoLast: () => {
    const last = get()
      .entries.filter((e) => e.status === 'fresh')
      .at(-1);
    if (last) get().undo(last.key);
  },
  commitAll: () => {
    for (const key of [...jobs.keys()]) commitEntry(key);
  },
}));

const removeEntry = (key: string) => {
  useDeletionStore.setState((state) => ({
    entries: state.entries.filter((e) => e.key !== key),
  }));
};

const commitEntry = async (key: string) => {
  const job = jobs.get(key);
  if (!job) return;

  clearTimeout(job.timer);
  jobs.delete(key);
  useDeletionStore.setState((state) => ({
    entries: state.entries.map((e) =>
      e.key === key ? { ...e, status: 'committing' } : e
    ),
  }));
  try {
    await job.commit();
  } catch (error) {
    job.onError?.(error);
  } finally {
    removeEntry(key);
  }
};

export type ScheduleDeletionInput<TData = unknown> = {
  kind: string;
  id: string;
  message: string;
  data?: TData;
  commit: () => Promise<unknown>;
  onError?: (error: unknown) => void;
};

export const scheduleDeletion = <TData = unknown>({
  kind,
  id,
  message,
  data,
  commit,
  onError,
}: ScheduleDeletionInput<TData>) => {
  const key = `${kind}:${id}`;
  if (jobs.has(key)) return;

  jobs.set(key, {
    timer: setTimeout(() => commitEntry(key), UNDO_WINDOW_MS),
    commit,
    onError,
  });

  useDeletionStore.setState((state) => ({
    entries: [
      ...state.entries,
      { key, kind, id, message, data, status: 'fresh' },
    ],
  }));
};

export const usePendingDeletions = <TData = unknown>(kind: string) => {
  const entries = useDeletionStore((state) => state.entries);
  return useMemo(
    () => entries.filter((e) => e.kind === kind) as PendingDeletion<TData>[],
    [entries, kind]
  );
};
