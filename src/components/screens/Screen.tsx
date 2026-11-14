import { cn } from '@/utils/cn';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = Omit<ScrollViewProps, 'contentContainerStyle'> & {
  className?: string;
  contentContainerClassName?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  className,
  contentContainerClassName,
  contentContainerStyle,
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      {...props}
      className={cn('bg-background flex-1', className)}
      contentContainerClassName={cn('px-4', contentContainerClassName)}
      contentContainerStyle={[
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}
