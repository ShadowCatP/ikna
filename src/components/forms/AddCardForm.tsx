import { useDecks } from '@/client/decks';
import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/common/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/common/DropdownMenu';
import { Lucide } from '@/components/ui/icons';
import { formatCardCount } from '@/utils/plural';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { z } from 'zod';

const MAX_FRONT_LENGTH = 150;
const MAX_BACK_LENGTH = 300;

const addCardSchema = z.object({
  deckId: z.string().min(1, 'Choose a deck'),
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
  const { data: decks = [], isPending, isError } = useDecks();
  const [isDeckModalVisible, setIsDeckModalVisible] = useState(false);
  const form = useForm({
    defaultValues: {
      deckId: '',
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

  return (
    <>
      <View className="gap-7">
        <form.Field name="deckId">
          {(field) => {
            const selectedDeck = decks.find(
              (deck) => deck.id === field.state.value
            );

            return (
              <View>
                <DropdownMenuTrigger
                  label="Deck"
                  accessibilityLabel="Choose deck"
                  onPress={() => setIsDeckModalVisible(true)}
                  title={selectedDeck?.title ?? 'None'}
                  subtitle={
                    selectedDeck
                      ? formatCardCount(selectedDeck.cardCount)
                      : 'Choose a deck'
                  }
                  leading={
                    <View className="bg-primary size-12 items-center justify-center rounded-full">
                      {selectedDeck ? (
                        <Text className="text-background text-base font-medium">
                          {selectedDeck.title.slice(0, 2).toUpperCase()}
                        </Text>
                      ) : (
                        <Lucide
                          name="minus"
                          size={22}
                          className="text-background"
                        />
                      )}
                    </View>
                  }
                />
                <View className="mt-2 min-h-5">
                  <FieldError meta={field.state.meta} />
                </View>

                <DropdownMenu
                  visible={isDeckModalVisible}
                  title="Choose deck"
                  options={[
                    { label: 'None', value: '' },
                    ...decks.map((deck) => ({
                      label: deck.title,
                      value: deck.id,
                    })),
                  ]}
                  selectedValue={field.state.value}
                  onSelect={(value) => form.setFieldValue('deckId', value)}
                  onClose={() => setIsDeckModalVisible(false)}
                  isLoading={isPending}
                  errorMessage={isError ? 'Could not load decks.' : undefined}
                  emptyMessage="No decks available."
                  closeAccessibilityLabel="Close deck selector"
                />
              </View>
            );
          }}
        </form.Field>

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
        <Button variant="outline" onPress={() => void form.handleSubmit()}>
          <Text className="text-foreground font-medium">
            Create card and add another
          </Text>
        </Button>
        <Button
          accessibilityLabel="Save card"
          onPress={() => void form.handleSubmit()}
        >
          <Text className="text-background font-medium">Create card</Text>
        </Button>
      </View>
    </>
  );
}
