import { Lucide } from '@/components/ui/icons';
import { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AddMenuSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function AddMenuModal({ visible, onClose }: AddMenuSheetProps) {
  const insets = useSafeAreaInsets();
  const [isClosing, setIsClosing] = useState(false);
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetOffset] = useState(() => new Animated.Value(1));

  function handleClose() {
    setIsClosing(true);
    onClose();
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(sheetOffset, {
        toValue: visible ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && !visible) {
        setIsClosing(false);
      }
    });
  }, [backdropOpacity, sheetOffset, visible]);

  if (!visible && !isClosing) {
    return null;
  }

  return (
    <Modal visible transparent onRequestClose={handleClose}>
      <View className="flex-1 justify-end">
        <Animated.View
          pointerEvents="none"
          className="absolute inset-0 bg-black"
          style={{
            opacity: backdropOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
            }),
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close add menu"
          onPress={handleClose}
          className="absolute inset-0"
        />
        <Animated.View
          className="bg-background rounded-t-3xl px-5 pt-5"
          style={{
            paddingBottom: insets.bottom + 24,
            transform: [
              {
                translateY: sheetOffset.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 600],
                }),
              },
            ],
          }}
        >
          <Text className="text-foreground mb-4 text-2xl font-bold">
            What do you want to add?
          </Text>

          <View className="gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add a card"
              onPress={handleClose}
              className="bg-surface flex-row items-center gap-5 rounded-2xl px-5 py-2"
            >
              <View className="bg-accent size-14 items-center justify-center rounded-full">
                <Lucide name="plus" size={26} />
              </View>
              <Text className="text-xl font-medium">Add a card</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create a deck"
              onPress={handleClose}
              className="bg-surface flex-row items-center gap-5 rounded-2xl px-5 py-2"
            >
              <View className="bg-accent-secondary size-14 items-center justify-center rounded-full">
                <Lucide name="layers" size={26} />
              </View>
              <Text className="text-xl font-medium">Create a deck</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
