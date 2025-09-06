import { RecurringItem } from '@/types/financial';

export const DEFAULT_SEED_DATA: Omit<RecurringItem, 'id'>[] = [
  // Einnahmen
  {
    name: 'Kindergeld',
    amount: 255,
    dayOfMonth: 15,
    type: 'income',
    active: true
  },
  
  // Ausgaben
  {
    name: 'DE-Ticket',
    amount: 38,
    dayOfMonth: 4,
    type: 'expense',
    active: true
  },
  {
    name: 'AC+',
    amount: 15,
    dayOfMonth: 11,
    type: 'expense',
    active: true
  },
  {
    name: 'Spotify',
    amount: 15,
    dayOfMonth: 28,
    type: 'expense',
    active: true
  },
  {
    name: 'iCloud',
    amount: 6,
    dayOfMonth: 12,
    type: 'expense',
    active: true
  },
  {
    name: 'Telekom Fest.',
    amount: 22.5,
    dayOfMonth: 4,
    type: 'expense',
    active: true
  },
  {
    name: 'Telekom Mobil',
    amount: 20,
    dayOfMonth: 30,
    type: 'expense',
    active: true
  },
  {
    name: 'Miete',
    amount: 550,
    dayOfMonth: 1,
    type: 'expense',
    active: true
  },
  {
    name: 'Strom',
    amount: 17.5,
    dayOfMonth: 1,
    type: 'expense',
    active: true
  },
  {
    name: 'GEZ',
    amount: 9.2,
    dayOfMonth: 1,
    type: 'expense',
    active: true
  }
];