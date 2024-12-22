export function isServerReleased(): boolean {
  const releaseDate = new Date('2024-12-27T00:00:00');
  const now = new Date();
  return now >= releaseDate;
} 