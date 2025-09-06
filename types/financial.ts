export interface RecurringItem {
  id: string;
  name: string;
  amount: number;     // Always positive; type determines +/- in calculation
  dayOfMonth: number; // 1-31
  type: 'income' | 'expense';
  active: boolean;
}

export interface Inputs {
  kontostand: number;  // Account balance
  bargeld: number;     // Cash
  bekomme: number;     // One-time income this month
}

export interface CalculationResult {
  sofortVerfuegbar: number;      // Immediately available
  remainingIncome: number;       // Remaining income this month
  remainingExpense: number;      // Remaining expenses this month
  verfuegbarBisMonatsende: number; // Available until end of month
}

export interface AppState {
  inputs: Inputs;
  recurringItems: RecurringItem[];
  updateInputs: (inputs: Partial<Inputs>) => void;
  addRecurringItem: (item: Omit<RecurringItem, 'id'>) => void;
  updateRecurringItem: (id: string, item: Partial<RecurringItem>) => void;
  deleteRecurringItem: (id: string) => void;
  resetToDefault: () => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}