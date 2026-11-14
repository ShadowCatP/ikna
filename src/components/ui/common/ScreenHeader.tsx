import { Lucide } from '@/components/ui/icons';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type ScreenHeaderProps = {
  children: ReactNode;
  onBack: () => void;
};

export function ScreenHeader({ children, onBack }: ScreenHeaderProps) {
  return (
    <View className="mb-7 flex-row items-center gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        className="bg-surface size-11 items-center justify-center rounded-full"
      >
        <Lucide name="chevron-left" size={22} className="text-foreground" />
      </Pressable>
      {children}
    </View>
  );
}
