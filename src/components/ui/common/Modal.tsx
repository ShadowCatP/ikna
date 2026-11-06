import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Modal as NativeModal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ModalProps = {
  children: ReactNode;
  visible: boolean;
  onClose: () => void;
  closeAccessibilityLabel?: string;
};

export function Modal({
  children,
  visible,
  onClose,
  closeAccessibilityLabel = 'Close modal',
}: ModalProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetOffset] = useState(() => new Animated.Value(1));

  function handleClose() {
    onClose();
  }

  useEffect(() => {
    if (visible && !mounted) {
      const frame = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(frame);
    }

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
        setMounted(false);
      }
    });
  }, [backdropOpacity, mounted, sheetOffset, visible]);

  if (!mounted) {
    return null;
  }

  return (
    <NativeModal visible transparent onRequestClose={handleClose}>
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
          accessibilityLabel={closeAccessibilityLabel}
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
          {children}
        </Animated.View>
      </View>
    </NativeModal>
  );
}
