import { deleteCard } from '@/client/cards';
import { scheduleDeletion } from '@/lib/deletionStore';
import { Card } from '@/types/card';
import { Alert } from 'react-native';

export const CARD_DELETION_KIND = 'card';

export const useUndoableDeleteCard = () => {
  return (card: Card) => {
    scheduleDeletion<Card>({
      kind: CARD_DELETION_KIND,
      id: card.id,
      data: card,
      message: `Deleted "${card.frontContent}"`,
      commit: () => deleteCard({ id: card.id, deckId: card.deckId }),
      onError: (error) => {
        Alert.alert(
          'Could not delete card',
          error instanceof Error ? error.message : 'Please try again',
          [{ text: 'OK' }]
        );
      },
    });
  };
};
