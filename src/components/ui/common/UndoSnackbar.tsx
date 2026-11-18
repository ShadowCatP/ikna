import { Text, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Button } from './Button';

interface UndoSnackbarProps {
  message: string;
  extraCount?: number;
  onUndo: () => void;
}

export function UndoSnackbar({
  message,
  extraCount = 0,
  onUndo,
}: UndoSnackbarProps) {
  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 bottom-4 px-4">
      <Animated.View
        entering={SlideInDown.duration(250)}
        exiting={SlideOutDown.duration(250)}
        className="bg-muted flex-row items-center justify-between rounded-2xl px-4 py-2"
      >
        <Text numberOfLines={1} className="flex-1">
          {message}
        </Text>
        {extraCount > 0 && <Text>+{extraCount} more</Text>}
        <Button variant="ghost" onPress={onUndo}>
          <Text>Undo</Text>
        </Button>
      </Animated.View>
    </View>
  );
}
