import { useDeleteDeck, useUpdateDeck } from '@/client/decks';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/common/Button';
import { Modal } from '@/components/ui/common/Modal';
import { Lucide } from '@/components/ui/icons';
import type { DeckPreview } from '@/types/deck';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { z } from 'zod';

const MAX_DECK_NAME_LENGTH = 50;
const MAX_DECK_DESCRIPTION_LENGTH = 150;

const editDeckSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Name cannot be empty')
    .max(
      MAX_DECK_NAME_LENGTH,
      `Name should be less than ${MAX_DECK_NAME_LENGTH} characters`
    ),
  description: z
    .string()
    .trim()
    .max(
      MAX_DECK_DESCRIPTION_LENGTH,
      `Description should be less than ${MAX_DECK_DESCRIPTION_LENGTH} characters`
    ),
});

export function EditDeckForm({ deck }: { deck: DeckPreview }) {
  const updateDeckMutation = useUpdateDeck();
  const deleteDeckMutation = useDeleteDeck();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const form = useForm({
    defaultValues: {
      title: deck.title,
      description: deck.description ?? '',
    },
    validators: { onSubmit: editDeckSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateDeckMutation.mutateAsync({
          id: deck.id,
          ...value,
        });
        router.back();
      } catch (error) {
        Alert.alert(
          'Could not save deck',
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
    void deleteDeckMutation
      .mutateAsync(deck.id)
      .then(() => router.replace('/home'))
      .catch((error: unknown) => {
        Alert.alert(
          'Could not delete deck',
          error instanceof Error ? error.message : 'Please try again.',
          [{ text: 'OK' }]
        );
      });
  }

  return (
    <>
      <View className="">
        <form.Field name="title">
          {(field) => (
            <View>
              <Input
                label="Name"
                accessibilityLabel="Deck name"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_DECK_NAME_LENGTH}
                maxCharacterLimit={MAX_DECK_NAME_LENGTH}
                error={field.state.meta}
              />
            </View>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <View>
              <Input
                label="Description"
                accessibilityLabel="Deck description"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_DECK_DESCRIPTION_LENGTH}
                maxCharacterLimit={MAX_DECK_DESCRIPTION_LENGTH}
                error={field.state.meta}
              />
            </View>
          )}
        </form.Field>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete deck"
          onPress={handleDelete}
          disabled={
            updateDeckMutation.isPending || deleteDeckMutation.isPending
          }
          className="bg-surface min-h-14 flex-row items-center rounded-2xl px-4"
        >
          <Lucide name="trash-2" size={22} className="text-danger" />
          <Text className="text-danger ml-3 text-base">Delete deck</Text>
        </Pressable>
      </View>

      <View className="mt-auto pt-6">
        <Button
          disabled={
            updateDeckMutation.isPending || deleteDeckMutation.isPending
          }
          onPress={() => void form.handleSubmit()}
        >
          <Text className="text-on-cta text-base font-medium">
            Save changes
          </Text>
        </Button>
      </View>

      <Modal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        closeAccessibilityLabel="Cancel delete deck"
      >
        <Text className="text-foreground mb-2 text-2xl font-bold">
          Delete deck?
        </Text>
        <Text className="text-muted mb-6 text-base leading-6">
          Delete "{deck.title}"? This action cannot be undone.
        </Text>
        <View className="gap-3">
          <Button
            variant="destructive"
            disabled={deleteDeckMutation.isPending}
            onPress={handleConfirmDelete}
          >
            <Text className="text-background text-base font-medium">
              Delete deck
            </Text>
          </Button>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel delete deck"
            onPress={() => setIsDeleteModalVisible(false)}
            disabled={deleteDeckMutation.isPending}
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
