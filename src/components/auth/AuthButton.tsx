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
      className={`min-h-[54px] items-center justify-center rounded-[16px] bg-[#111113] px-[16px] py-[14px] active:opacity-60 ${compact ? 'mt-[4px]' : 'mt-[28px]'} ${disabled || busy ? 'opacity-60' : ''}`}
    >
      {busy ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-[16px] font-medium text-white">{title}</Text>
      )}
    </Pressable>
  );
}
