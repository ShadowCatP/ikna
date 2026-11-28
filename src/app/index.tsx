import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { session, isReady } = useAuth();

  if (!isReady) return null;

  return <Redirect href={session ? '/home' : '/auth/welcome'} />;
}
