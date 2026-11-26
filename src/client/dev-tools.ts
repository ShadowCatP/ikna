import { apiFetch } from '@/client/api';
import { useMutation } from '@tanstack/react-query';

export type SetCardsDueDateResult = {
  success: boolean;
  dueDate: string;
  updatedCount: number;
};

export async function setCardsDueDate(
  minutes: number
): Promise<SetCardsDueDateResult> {
  return apiFetch<SetCardsDueDateResult>('/api/dev-tools/due-date', {
    method: 'POST',
    body: { minutes },
  });
}

export function useSetCardsDueDate() {
  return useMutation({ mutationFn: setCardsDueDate });
}
