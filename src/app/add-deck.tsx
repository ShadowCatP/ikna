import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/common/Button';
import { Screen } from '@/components/ui/common/Screen';
import { ScreenHeader } from '@/components/ui/common/ScreenHeader';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { z } from 'zod';

const MAX_DECK_NAME_LENGTH = 50;
const MAX_DECK_DESCRIPTION_LENGTH = 150;

const addDeckSchema = z.object({
  name: z
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

export default function AddDeckScreen() {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    validators: { onSubmit: addDeckSchema },
    onSubmit: () => {
      Alert.alert('Create deck', 'To be implemented', [{ text: 'OK' }]);
    },
  });

  return (
    <Screen
      contentContainerClassName="grow"
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader onBack={() => router.back()}>
        <Text className="text-foreground text-2xl font-bold">New deck</Text>
      </ScreenHeader>

      <View className="gap-6">
        <form.Field name="name">
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
                placeholder="What is this deck about? (optional)"
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
      </View>

      <View className="mt-auto">
        <Button onPress={() => void form.handleSubmit()}>
          <Text className="text-background font-medium">Create deck</Text>
        </Button>
      </View>
    </Screen>
  );
}
