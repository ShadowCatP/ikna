import { supabase } from '@/utils/supabase';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!isActive) return;
      setSession(data.session);
      setIsReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (isActive) setSession(nextSession);
      }
    );

    return () => {
      isActive = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, isReady };
}
