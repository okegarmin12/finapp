import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { RecurringItem } from '@/types/financial';
import { InputField } from './InputField';
import { parseGermanDecimal, formatInputNumber } from '@/utils/formatUtils';

interface RecurringItemFormProps {
  onSubmit: (item: Omit<RecurringItem, 'id'>) => void;
  onCancel: () => void;
  initialData?: RecurringItem;
  title: string;
}

export function RecurringItemForm({ onSubmit, onCancel, initialData, title }: RecurringItemFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(formatInputNumber(initialData?.amount || 0));
  const [dayOfMonth, setDayOfMonth] = useState(initialData?.dayOfMonth?.toString() || '');
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
  const [active, setActive] = useState(initialData?.active ?? true);

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Namen ein.');
      return;
    }

    const parsedAmount = parseGermanDecimal(amount);
    if (parsedAmount <= 0) {
      Alert.alert('Fehler', 'Betrag muss größer als 0 sein.');
      return;
    }

    const parsedDay = parseInt(dayOfMonth);
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      Alert.alert('Fehler', 'Tag muss zwischen 1 und 31 liegen.');
      return;
    }

    onSubmit({
      name: name.trim(),
      amount: parsedAmount,
      dayOfMonth: parsedDay,
      type,
      active
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <InputField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="z.B. Miete, Gehalt..."
        keyboardType="default"
      />

      <InputField
        label="Betrag"
        value={amount}
        onChangeText={setAmount}
        placeholder="0,00"
        suffix="€"
      />

      <InputField
        label="Tag im Monat"
        value={dayOfMonth}
        onChangeText={setDayOfMonth}
        placeholder="1-31"
        keyboardType="numeric"
      />

      <View style={styles.typeContainer}>
        <Text style={styles.label}>Typ</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.incomeSelected]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeButtonText, type === 'income' && styles.selectedText]}>
              Einnahme
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.expenseSelected]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeButtonText, type === 'expense' && styles.selectedText]}>
              Ausgabe
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Aktiv</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Abbrechen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Speichern</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  typeContainer: {
    marginVertical: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  incomeSelected: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  expenseSelected: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedText: {
    color: '#111827',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});