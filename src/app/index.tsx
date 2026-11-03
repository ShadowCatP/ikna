import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { session, ready } = useAuth();

  if (!ready) return null;

  return <Redirect href={session ? '/home' : '/welcome'} />;
}
