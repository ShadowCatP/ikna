import { Button } from '@/components/ui/common/Button';
import { Lucide } from '@/components/ui/icons';
import { Image, Text, View } from 'react-native';

type EmptyDeckStateProps = {
  onAddCard: () => void;
};

export function EmptyDeckState({ onAddCard }: EmptyDeckStateProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="relative mb-6 size-60 items-center justify-center">
        <View className="bg-accent absolute inset-0 rounded-full" />
        <Image
          accessibilityIgnoresInvertColors
          source={require('@/assets/images/ikna-waving.png')}
          className="size-64"
          resizeMode="contain"
        />
      </View>
      <Text className="text-foreground text-center text-3xl font-bold">
        No cards yet
      </Text>
      <Text className="text-muted mt-3 max-w-sm text-center text-base leading-6">
        Add your first card: a word on the front, its meaning on the back. It
        will show up in your daily review.
      </Text>
      <Button className="mt-8 w-full" onPress={onAddCard}>
        <View className="flex-row items-center gap-2">
          <Lucide name="plus" size={22} className="text-on-cta" />
          <Text className="text-on-cta text-base font-medium">Add a card</Text>
        </View>
      </Button>
    </View>
  );
}
