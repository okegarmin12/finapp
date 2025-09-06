/**
 * Format number as German EUR currency
 * @param amount Number to format
 * @returns Formatted string like "1.234,56 €"
 */
export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Parse German decimal input (accepts both comma and dot)
 * @param input String input like "1234,56" or "1234.56"
 * @returns Parsed number
 */
export function parseGermanDecimal(input: string): number {
  if (!input || input.trim() === '') return 0;
  
  // Replace comma with dot for parsing
  const normalized = input.replace(',', '.');
  const parsed = parseFloat(normalized);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format number for input field (German style with comma)
 * @param value Number to format
 * @returns String like "1234,56"
 */
export function formatInputNumber(value: number): string {
  if (value === 0) return '';
  return value.toString().replace('.', ',');
}