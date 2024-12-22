export function isUpdateDay(): boolean {
  const today = new Date();
  return today.getDay() === 0; 
} 