import { Modal } from '@/components/ui/Modal';
import { Lucide } from '@/components/ui/icons';
import { Pressable, Text, View } from 'react-native';

type AddMenuSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function AddMenuModal({ visible, onClose }: AddMenuSheetProps) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      closeAccessibilityLabel="Close add menu"
    >
      {(handleClose) => (
        <>
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
        </>
      )}
    </Modal>
  );
}
