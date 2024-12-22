export function isUpdateDay(): boolean {
  const today = new Date();
  return today.getDay() === 5; // 5 = Freitag
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('de-DE');
} 