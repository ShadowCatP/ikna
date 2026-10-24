import { errorText } from '@/utils/form';
import { Text } from 'react-native';

type Meta = { isTouched: boolean; errors: readonly unknown[] };

export function FieldError({ meta }: { meta: Meta }) {
  const message = meta.isTouched ? errorText(meta.errors) : undefined;
  if (!message) return null;
  return <Text className="text-sm text-red-600">{message}</Text>;
}
