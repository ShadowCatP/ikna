import { useUpdateDeck } from '@/client/decks';
import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/common/Button';
import { Lucide } from '@/components/ui/icons';
import type { DeckPreview } from '@/types/deck';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
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
    Alert.alert('Delete deck', 'To be implemented', [{ text: 'OK' }]);
  }

  return (
    <>
      <View className="gap-6">
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
              />
              <View className="mt-2 min-h-6 flex-row justify-between">
                <View className="flex-1">
                  <FieldError meta={field.state.meta} />
                </View>
                <Text className="text-muted shrink-0 text-xs">
                  {field.state.value.length} / {MAX_DECK_NAME_LENGTH}
                </Text>
              </View>
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
              />
              <View className="mt-2 min-h-6 flex-row justify-between">
                <View className="flex-1">
                  <FieldError meta={field.state.meta} />
                </View>
                <Text className="text-muted shrink-0 text-xs">
                  {field.state.value.length} / {MAX_DECK_DESCRIPTION_LENGTH}
                </Text>
              </View>
            </View>
          )}
        </form.Field>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete deck"
          onPress={handleDelete}
          className="bg-surface min-h-14 flex-row items-center rounded-2xl px-4"
        >
          <Lucide name="trash-2" size={22} className="text-danger" />
          <Text className="text-danger ml-3 text-base">Delete deck</Text>
        </Pressable>
      </View>

      <View className="mt-auto pt-6">
        <Button
          disabled={updateDeckMutation.isPending}
          onPress={() => void form.handleSubmit()}
        >
          <Text className="text-background text-base font-medium">
            Save changes
          </Text>
        </Button>
      </View>
    </>
  );
}
