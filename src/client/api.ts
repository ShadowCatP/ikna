import { supabase } from '@/utils/supabase';

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

type ApiErrorBody = {
  error?: string;
};

export async function apiFetch<T>(
  path: string,
  { body, headers: requestHeaders, ...options }: ApiFetchOptions = {}
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const headers = new Headers(requestHeaders);
  headers.set('Authorization', `Bearer ${session.access_token}`);

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...options,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorBody | null;
    throw new Error(errorBody?.error ?? `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
