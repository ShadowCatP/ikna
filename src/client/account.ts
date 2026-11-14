import { apiFetch } from '@/client/api';
import { useMutation } from '@tanstack/react-query';

export async function deleteAccount(): Promise<void> {
  await apiFetch<{ success: boolean }>('/api/account', {
    method: 'DELETE',
  });
}

export function useDeleteAccount() {
  return useMutation({ mutationFn: deleteAccount });
}
