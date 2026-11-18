import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
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
    <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0 px-4">
      <Animated.View>
        <Text numberOfLines={1} className="flex-1">
          {message}
        </Text>
        {extraCount > 0 && <Text>+{extraCount} more</Text>}
        <Button onPress={onUndo}>
          <Text>Undo</Text>
        </Button>
      </Animated.View>
    </View>
  );
}
