import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/common/Button';
import { Lucide } from '@/components/ui/icons';
import { useForm } from '@tanstack/react-form';
import { Alert, Pressable, Text, View } from 'react-native';
import { z } from 'zod';

const MAX_FRONT_LENGTH = 150;
const MAX_BACK_LENGTH = 300;

const addCardSchema = z.object({
  front: z
    .string()
    .trim()
    .min(1, 'Front cannot be empty')
    .max(
      MAX_FRONT_LENGTH,
      `Front should be less than ${MAX_FRONT_LENGTH} characters`
    ),
  back: z
    .string()
    .trim()
    .min(1, 'Back cannot be empty')
    .max(
      MAX_BACK_LENGTH,
      `Back should be less than ${MAX_BACK_LENGTH} characters`
    ),
});

export function AddCardForm() {
  const form = useForm({
    defaultValues: {
      front: '',
      back: '',
    },
    validators: { onSubmit: addCardSchema },
    onSubmit: async () => {
      Alert.alert('Coming soon', 'Saving cards is not available yet.', [
        { text: 'OK' },
      ]);
    },
  });

  function showPlaceholder(message: string) {
    Alert.alert('Coming soon', message, [{ text: 'OK' }]);
  }

  return (
    <>
      <View className="gap-7">
        <View className="gap-2">
          <Text className="text-muted text-xs font-medium tracking-wide uppercase">
            Deck
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose deck"
            onPress={() =>
              showPlaceholder('Deck selection is not available yet.')
            }
            className="bg-surface min-h-20 flex-row items-center rounded-2xl px-4"
          >
            <View className="bg-primary size-12 items-center justify-center rounded-full">
              <Text className="text-background text-base font-medium">SA</Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-foreground text-lg">Spanish A1</Text>
              <Text className="text-muted mt-1 text-sm">25 cards</Text>
            </View>
            <Lucide name="chevron-down" size={22} className="text-muted" />
          </Pressable>
        </View>

        <form.Field name="front">
          {(field) => (
            <View>
              <Input
                label="Front"
                accessibilityLabel="Card front"
                placeholder="Word or phrase"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_FRONT_LENGTH}
                multiline
                textAlignVertical="top"
                className="bg-surface min-h-32 border-0 px-4"
              />
              <View className="mt-2 min-h-5 flex-row justify-between">
                <View className="flex-1">
                  <FieldError meta={field.state.meta} />
                </View>
                <Text className="text-muted shrink-0 text-xs">
                  {field.state.value.length} / {MAX_FRONT_LENGTH}
                </Text>
              </View>
            </View>
          )}
        </form.Field>

        <form.Field name="back">
          {(field) => (
            <View>
              <Input
                label="Back"
                accessibilityLabel="Card back"
                placeholder="Meaning or translation"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                maxLength={MAX_BACK_LENGTH}
                multiline
                textAlignVertical="top"
                className="bg-surface min-h-32 border-0 px-4"
              />
              <View className="mt-2 min-h-5 flex-row justify-between">
                <View className="flex-1">
                  <FieldError meta={field.state.meta} />
                </View>
                <Text className="text-muted shrink-0 text-xs">
                  {field.state.value.length} / {MAX_BACK_LENGTH}
                </Text>
              </View>
            </View>
          )}
        </form.Field>
      </View>

      <View className="mt-auto gap-3 pt-8">
        <Button onPress={() => void form.handleSubmit()}>
          <Text className="text-background font-medium">
            Save and add another
          </Text>
        </Button>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save card"
          onPress={() => void form.handleSubmit()}
          className="border-foreground min-h-14 items-center justify-center rounded-2xl border-2 px-4 py-3.5 active:opacity-60"
        >
          <Text className="text-foreground font-medium">Save</Text>
        </Pressable>
      </View>
    </>
  );
}
