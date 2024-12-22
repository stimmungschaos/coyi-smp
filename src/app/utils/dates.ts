export function isUpdateDay(): boolean {
  const today = new Date();
  return today.getDay() === 0; // 0 = Sonntag, 6 = Samstag
} 