import { ActivityIndicator, Text, View } from 'react-native';

type ScreenLoadingProps = {
  message?: string;
};

export function ScreenLoading({ message = 'Loading...' }: ScreenLoadingProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator className="text-primary" />
      <Text className="text-muted mt-3 text-base">{message}</Text>
    </View>
  );
}
