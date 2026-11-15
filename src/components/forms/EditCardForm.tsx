import { useDeleteCard, useUpdateCard } from '@/client/cards';
import { Input } from '@/components/forms/Input';
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
  const updateCardMutation = useUpdateCard();
  const deleteCardMutation = useDeleteCard();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const form = useForm({
    defaultValues: {
      front: card.frontContent,
      back: card.backContent,
    },
    validators: { onSubmit: editCardSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateCardMutation.mutateAsync({ id: card.id, ...value });
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

  function handleConfirmDelete() {
    setIsDeleteModalVisible(false);
    void deleteCardMutation
      .mutateAsync({ id: card.id })
      .then(() => router.back())
      .catch((error: unknown) => {
        Alert.alert(
          'Could not delete card',
          error instanceof Error ? error.message : 'Please try again.',
          [{ text: 'OK' }]
        );
      });
  }

  const isBusy = updateCardMutation.isPending || deleteCardMutation.isPending;

  return (
    <>
      <View className="gap-7">
        <form.Field name="front">
          {(field) => (
            <View>
              <Input
                label="Front"
                accessibilityLabel="Card front"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_FRONT_LENGTH}
                multiline
                textAlignVertical="top"
                className="bg-surface min-h-32 border-0 px-4"
                maxCharacterLimit={MAX_FRONT_LENGTH}
                error={field.state.meta}
              />
            </View>
          )}
        </form.Field>

        <form.Field name="back">
          {(field) => (
            <View>
              <Input
                label="Back"
                accessibilityLabel="Card back"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_BACK_LENGTH}
                multiline
                textAlignVertical="top"
                className="bg-surface min-h-32 border-0 px-4"
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
          disabled={isBusy}
          className="bg-surface min-h-14 flex-row items-center rounded-2xl px-4"
        >
          <Lucide name="trash-2" size={22} className="text-danger" />
          <Text className="text-danger ml-3 text-base">Delete card</Text>
        </Pressable>
      </View>

      <View className="mt-auto pt-8">
        <Button disabled={isBusy} onPress={() => void form.handleSubmit()}>
          <Text className="text-background text-base font-medium">
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
          <Button
            variant="destructive"
            disabled={deleteCardMutation.isPending}
            onPress={handleConfirmDelete}
          >
            <Text className="text-background text-base font-medium">
              Delete card
            </Text>
          </Button>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel delete card"
            onPress={() => setIsDeleteModalVisible(false)}
            disabled={deleteCardMutation.isPending}
            className="bg-surface min-h-14 items-center justify-center rounded-2xl"
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
