import { Button } from '@/components/ui/common/Button';
import { Lucide } from '@/components/ui/icons';
import { Image, Text, View } from 'react-native';
import { Screen } from './Screen';

type EmptyDecksScreenProps = {
  onCreateDeck: () => void;
};

export function EmptyDecksScreen({ onCreateDeck }: EmptyDecksScreenProps) {
  return (
    <Screen contentContainerClassName="items-center">
      <View className="bg-accent mb-8 size-72 items-center justify-center rounded-full">
        <Image
          accessibilityIgnoresInvertColors
          source={require('@/assets/images/ikna-excited.png')}
          className="size-[260px]"
          resizeMode="contain"
        />
      </View>

      <Text className="text-foreground w-72 text-center text-4xl leading-12 font-bold">
        Let's make your first deck!
      </Text>

      <Text className="text-muted mt-5 max-w-sm text-center text-lg leading-7">
        A deck is a set of cards on one topic - like "Spanish A1". Add cards,
        and I'll tell you when to review them.
      </Text>

      <Button className="mt-10 w-full" onPress={onCreateDeck}>
        <View className="flex-row items-center gap-3">
          <Lucide name="plus" size={24} className="text-on-cta" />
          <Text className="text-on-cta text-lg font-medium">Create a deck</Text>
        </View>
      </Button>
    </Screen>
  );
}
