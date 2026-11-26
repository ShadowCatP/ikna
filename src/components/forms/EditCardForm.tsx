import { deleteCard, updateCard } from '@/client/cards';
import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/common/Button';
import { Modal } from '@/components/ui/common/Modal';
import { Lucide } from '@/components/ui/icons';
import type { Card } from '@/types/card';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { z } from 'zod';

const MAX_FRONT_LENGTH = 150;
const MAX_BACK_LENGTH = 300;

const editCardSchema = z.object({
  front: z
    .string()
    .trim()
    .min(1, 'Front cannot be empty')
    .max(MAX_FRONT_LENGTH, 'Front is too long'),
  back: z
    .string()
    .trim()
    .min(1, 'Back cannot be empty')
    .max(MAX_BACK_LENGTH, 'Back is too long'),
});

export function EditCardForm({ card }: { card: Card }) {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const form = useForm({
    defaultValues: {
      front: card.frontContent,
      back: card.backContent,
    },
    validators: { onSubmit: editCardSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateCard({
          id: card.id,
          deckId: card.deckId,
          front: value.front,
          back: value.back,
        });

        router.back();
      } catch (error) {
        Alert.alert(
          'Could not save card',
          error instanceof Error ? error.message : 'Please try again.',
          [{ text: 'OK' }]
        );
      }
    },
  });

  function handleDelete() {
    setIsDeleteModalVisible(true);
  }

  async function handleConfirmDelete() {
    setIsDeleteModalVisible(false);
    await deleteCard({ id: card.id, deckId: card.deckId });
    router.back();
  }

  return (
    <>
      <View className="gap-7">
        <form.Field name="front">
          {(field) => (
            <View>
              <FormInput
                label="Front"
                accessibilityLabel="Card front"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_FRONT_LENGTH}
                multiline
                textAlignVertical="top"
                containerClassName="bg-surface min-h-32 border-0 dark:border"
                maxCharacterLimit={MAX_FRONT_LENGTH}
                error={field.state.meta}
              />
            </View>
          )}
        </form.Field>

        <form.Field name="back">
          {(field) => (
            <View>
              <FormInput
                label="Back"
                accessibilityLabel="Card back"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_BACK_LENGTH}
                multiline
                textAlignVertical="top"
                containerClassName="bg-surface min-h-32 border-0 dark:border"
                maxCharacterLimit={MAX_BACK_LENGTH}
                error={field.state.meta}
              />
            </View>
          )}
        </form.Field>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete card"
          onPress={handleDelete}
          className="bg-surface min-h-14 flex-row items-center rounded-2xl px-4"
        >
          <Lucide name="trash-2" size={22} className="text-danger" />
          <Text className="text-danger ml-3 text-base">Delete card</Text>
        </Pressable>
      </View>

      <View className="mt-auto pt-8">
        <Button onPress={() => void form.handleSubmit()}>
          <Text className="text-on-cta text-base font-medium">
            Save changes
          </Text>
        </Button>
      </View>

      <Modal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        closeAccessibilityLabel="Cancel delete card"
      >
        <Text className="text-foreground mb-2 text-2xl font-bold">
          Delete card?
        </Text>
        <Text className="text-muted mb-6 text-base leading-6">
          This action cannot be undone.
        </Text>
        <View className="gap-3">
          <Button variant="destructive" onPress={handleConfirmDelete}>
            <Text className="text-background text-base font-medium">
              Delete card
            </Text>
          </Button>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel delete card"
            onPress={() => setIsDeleteModalVisible(false)}
            className="bg-surface dark:border-foreground min-h-14 items-center justify-center rounded-2xl dark:border-2 dark:bg-transparent"
          >
            <Text className="text-foreground text-base font-medium">
              Cancel
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}
