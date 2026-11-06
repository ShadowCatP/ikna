export function formatDeckCount(count: number) {
  const label = count === 1 ? 'deck' : 'decks';

  return `${count} ${label}`;
}
