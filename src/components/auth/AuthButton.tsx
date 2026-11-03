import { ActivityIndicator, Pressable, Text } from 'react-native';

export function AuthButton({
  title,
  busy = false,
  disabled = false,
  onPress,
  compact = false,
}: {
  title: string;
  busy?: boolean;
  disabled?: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || busy}
      onPress={onPress}
      className={`bg-foreground min-h-14 items-center justify-center rounded-2xl px-4 py-3.5 active:opacity-60 ${compact ? 'mt-1' : 'mt-7'} ${disabled || busy ? 'opacity-60' : ''}`}
    >
      {busy ? (
        <ActivityIndicator className="text-background" />
      ) : (
        <Text className="text-background text-base font-medium">{title}</Text>
      )}
    </Pressable>
  );
}
