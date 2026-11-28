import type { SupabaseClient } from '@supabase/supabase-js';

const INVALID_LINK =
  'This reset link is invalid or expired. Please request a new one.';

export function parseRecoveryLink(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(INVALID_LINK);
  }
  const params = new URLSearchParams(parsed.hash.slice(1));
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (
    params.has('error_description') ||
    parsed.searchParams.has('error_description') ||
    params.get('type') !== 'recovery' ||
    !accessToken ||
    !refreshToken
  ) {
    throw new Error(INVALID_LINK);
  }
  return { access_token: accessToken, refresh_token: refreshToken };
}

export async function verifyRecoveryLink(
  url: string,
  auth: Pick<SupabaseClient['auth'], 'setSession'>
) {
  const { error } = await auth.setSession(parseRecoveryLink(url));
  if (error) throw new Error(INVALID_LINK);
}
