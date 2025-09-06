import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Inputs, RecurringItem } from '@/types/financial';
import { DEFAULT_SEED_DATA } from '@/data/seedData';

const STORAGE_KEYS = {
  INPUTS: '@financial_planner_inputs',
  ITEMS: '@financial_planner_items'
};

const DEFAULT_INPUTS: Inputs = {
  kontostand: 0,
  bargeld: 0,
  bekomme: 0
};

export const useFinancialStore = create<AppState>((set, get) => ({
  inputs: DEFAULT_INPUTS,
  recurringItems: [],

  updateInputs: (newInputs: Partial<Inputs>) => {
    const updatedInputs = { ...get().inputs, ...newInputs };
    set({ inputs: updatedInputs });
    get().saveData();
  },

  addRecurringItem: (item: Omit<RecurringItem, 'id'>) => {
    const newItem: RecurringItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    set(state => ({ 
      recurringItems: [...state.recurringItems, newItem] 
    }));
    get().saveData();
  },

  updateRecurringItem: (id: string, updates: Partial<RecurringItem>) => {
    set(state => ({
      recurringItems: state.recurringItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
    get().saveData();
  },

  deleteRecurringItem: (id: string) => {
    set(state => ({
      recurringItems: state.recurringItems.filter(item => item.id !== id)
    }));
    get().saveData();
  },

  resetToDefault: () => {
    const defaultItems: RecurringItem[] = DEFAULT_SEED_DATA.map((item, index) => ({
      ...item,
      id: `seed_${index}_${Date.now()}`
    }));
    
    set({ recurringItems: defaultItems });
    get().saveData();
  },

  loadData: async () => {
    try {
      const [inputsData, itemsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.INPUTS),
        AsyncStorage.getItem(STORAGE_KEYS.ITEMS)
      ]);

      const inputs = inputsData ? JSON.parse(inputsData) : DEFAULT_INPUTS;
      let items: RecurringItem[] = [];

      if (itemsData) {
        items = JSON.parse(itemsData);
      } else {
        // First time - create seed data
        items = DEFAULT_SEED_DATA.map((item, index) => ({
          ...item,
          id: `seed_${index}_${Date.now()}`
        }));
      }

      set({ inputs, recurringItems: items });
    } catch (error) {
      console.error('Error loading data:', error);
      // Use defaults on error
      get().resetToDefault();
    }
  },

  saveData: async () => {
    try {
      const { inputs, recurringItems } = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.INPUTS, JSON.stringify(inputs)),
        AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(recurringItems))
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
}));