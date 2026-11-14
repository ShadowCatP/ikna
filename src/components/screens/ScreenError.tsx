import { Pressable, Text, View } from 'react-native';

type ScreenErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function ScreenError({
  message = 'Could not load this screen.',
  onRetry,
}: ScreenErrorProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <Text className="text-muted text-center text-base">{message}</Text>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try again"
          onPress={onRetry}
          className="bg-surface rounded-xl px-4 py-2"
        >
          <Text className="text-foreground text-sm font-medium">Try again</Text>
        </Pressable>
      )}
    </View>
  );
}
