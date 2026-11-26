import { useDecks } from '@/client/decks';
import { useSetCardsDueDate } from '@/client/dev-tools';
import { Screen } from '@/components/screens/Screen';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { Button } from '@/components/ui/common/Button';
import { Section } from '@/components/ui/common/Section';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SpinnerInput } from '../../components/ui/common/SpinnerInput';

export default function DevToolsScreen() {
  const [minutes, setMinutes] = useState('15');
  const dueDateMutation = useSetCardsDueDate();
  const { refetch: refreshDecks } = useDecks();
  const minuteCount = Number(minutes);
  const isValidDuration =
    Number.isInteger(minuteCount) && minuteCount >= 1 && minuteCount <= 1440;

  function handleSetDueDate() {
    if (!isValidDuration || dueDateMutation.isPending) return;

    dueDateMutation.mutate(minuteCount, {
      onSuccess: () => refreshDecks(),
    });
  }

  return (
    <Screen>
      <ScreenHeader onBack={() => router.back()}>
        <Text className="text-foreground text-2xl font-bold">Dev Tools</Text>
      </ScreenHeader>
      <Section title="Cards Due" className="gap-6">
        <SpinnerInput
          label="Minutes from now"
          value={minutes}
          onChangeText={(value) => {
            setMinutes(value);
            dueDateMutation.reset();
          }}
          maxLength={4}
          min={1}
          max={1440}
          accessibilityLabel="Minutes until cards are due"
        />
        {dueDateMutation.error && (
          <Text className="text-danger text-sm">
            {dueDateMutation.error.message}
          </Text>
        )}
        {dueDateMutation.data && (
          <Text className="text-success text-sm">
            {dueDateMutation.data.updatedCount === 0
              ? 'No cards to update.'
              : `Updated ${dueDateMutation.data.updatedCount} ${dueDateMutation.data.updatedCount === 1 ? 'card' : 'cards'}.`}{' '}
            Due at {new Date(dueDateMutation.data.dueDate).toLocaleTimeString()}
            .
          </Text>
        )}
        <Button
          variant="surface"
          className="flex-row gap-3"
          disabled={!isValidDuration || dueDateMutation.isPending}
          onPress={handleSetDueDate}
        >
          {dueDateMutation.isPending ? (
            <ActivityIndicator className="text-foreground" />
          ) : null}
          <Text className="text-foreground">Set all cards due</Text>
        </Button>
      </Section>
    </Screen>
  );
}
