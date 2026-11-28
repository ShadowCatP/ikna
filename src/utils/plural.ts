export function formatDeckCount(count: number) {
  const label = count === 1 ? 'deck' : 'decks';

  return `${count} ${label}`;
}

export function formatCardCount(count: number) {
  const label = count === 1 ? 'card' : 'cards';

  return `${count} ${label}`;
}
