import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { RecurringItem } from '@/types/financial';
import { formatEUR } from '@/utils/formatUtils';

interface UpcomingItemsListProps {
  items: RecurringItem[];
}

export function UpcomingItemsList({ items }: UpcomingItemsListProps) {
  const renderItem = ({ item }: { item: RecurringItem }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDay}>{item.dayOfMonth}. des Monats</Text>
      </View>
      <Text style={[
        styles.itemAmount,
        item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
      ]}>
        {item.type === 'income' ? '+' : '-'}{formatEUR(item.amount)}
      </Text>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bevorstehende Posten</Text>
        <Text style={styles.emptyText}>Keine bevorstehenden Posten in diesem Monat</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bevorstehende Posten</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemDay: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#059669',
  },
  expenseAmount: {
    color: '#dc2626',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});