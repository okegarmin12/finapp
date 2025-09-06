import { Inputs, RecurringItem, CalculationResult } from '@/types/financial';
import { isUpcomingThisMonth } from './dateUtils';

/**
 * Calculate available amount until end of month
 */
export function calcAvailable(
  inputs: Inputs, 
  items: RecurringItem[], 
  today: Date
): CalculationResult {
  const upcoming = items.filter(i => 
    i.active && isUpcomingThisMonth(i.dayOfMonth, today)
  );
  
  const remainingIncome = upcoming
    .filter(i => i.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const remainingExpense = upcoming
    .filter(i => i.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const sofortVerfuegbar = inputs.kontostand + inputs.bargeld + inputs.bekomme;
  const verfuegbarBisMonatsende = sofortVerfuegbar + remainingIncome - remainingExpense;
  
  return {
    sofortVerfuegbar,
    remainingIncome,
    remainingExpense,
    verfuegbarBisMonatsende
  };
}

/**
 * Get upcoming items sorted by day
 */
export function getUpcomingItems(items: RecurringItem[], today: Date): RecurringItem[] {
  return items
    .filter(i => i.active && isUpcomingThisMonth(i.dayOfMonth, today))
    .sort((a, b) => a.dayOfMonth - b.dayOfMonth);
}