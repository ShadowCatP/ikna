import { apiFetch } from '@/client/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export type AccountProfile = {
  allowDevTools: boolean;
};

export async function getAccountProfile(): Promise<AccountProfile> {
  return apiFetch<AccountProfile>('/api/account');
}

export function useAccountProfile(userId?: string) {
  return useQuery({
    queryKey: ['account-profile', userId],
    queryFn: getAccountProfile,
    enabled: Boolean(userId),
  });
}

export async function deleteAccount(): Promise<void> {
  await apiFetch<{ success: boolean }>('/api/account', {
    method: 'DELETE',
  });
}

export function useDeleteAccount() {
  return useMutation({ mutationFn: deleteAccount });
}
