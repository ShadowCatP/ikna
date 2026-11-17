import { useCreateDeck } from '@/client/decks';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/common/Button';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { z } from 'zod';

const MAX_DECK_NAME_LENGTH = 50;
const MAX_DECK_DESCRIPTION_LENGTH = 150;

const addDeckSchema = z.object({
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

export function AddDeckForm() {
  const createDeckMutation = useCreateDeck();
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    validators: { onSubmit: addDeckSchema },
    onSubmit: async ({ value }) => {
      try {
        await createDeckMutation.mutateAsync(value);
        router.back();
      } catch (error) {
        Alert.alert(
          'Could not create deck',
          error instanceof Error ? error.message : 'Please try again.',
          [{ text: 'OK' }]
        );
      }
    },
  });

  return (
    <>
      <View className="gap-6">
        <form.Field name="title">
          {(field) => (
            <View>
              <Input
                label="Name"
                accessibilityLabel="Deck name"
                placeholder="What is your deck name?"
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
                placeholder="What is this deck about? (optional)"
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
      </View>

      <View className="mt-auto">
        <Button
          disabled={createDeckMutation.isPending}
          onPress={() => void form.handleSubmit()}
        >
          <Text className="text-on-cta font-medium">Create deck</Text>
        </Button>
      </View>
    </>
  );
}
