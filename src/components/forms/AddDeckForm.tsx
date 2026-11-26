import { createDeck } from '@/client/decks';
import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/common/Button';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    validators: { onSubmit: addDeckSchema },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        await createDeck(value);
        router.back();
      } catch (error) {
        Alert.alert(
          'Could not create deck',
          error instanceof Error ? error.message : 'Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <View className="gap-6">
        <form.Field name="title">
          {(field) => (
            <View>
              <FormInput
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
              <FormInput
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
          disabled={isSubmitting}
          onPress={() => void form.handleSubmit()}
        >
          <Text className="text-on-cta font-medium">Create deck</Text>
        </Button>
      </View>
    </>
  );
}
