export function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return 'Never';
  const diffSec = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(isoString)) / 1000)
  );
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  return `${Math.floor(diffHr / 24)} d ago`;
}
