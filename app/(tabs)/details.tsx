import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useFinancialStore } from '@/store/useFinancialStore';
import { calcAvailable, getUpcomingItems } from '@/utils/calculations';
import { getCurrentDateBerlin } from '@/utils/dateUtils';
import { formatEUR } from '@/utils/formatUtils';
import { RecurringItem } from '@/types/financial';

interface DayBalance {
  day: number;
  netChange: number;
  items: RecurringItem[];
}

// Sichere Datums-Funktion
const getSafeCurrentDate = () => {
  try {
    const berlinDate = getCurrentDateBerlin();
    if (berlinDate && !isNaN(berlinDate.getTime())) {
      return berlinDate;
    }
  } catch (error) {
    console.warn('getCurrentDateBerlin failed:', error);
  }
  return new Date();
};

export default function DetailsScreen() {
  const { inputs, recurringItems, loadData } = useFinancialStore();

  useEffect(() => {
    loadData();
  }, []);

  const today = getSafeCurrentDate();
  const calculation = calcAvailable(inputs || {}, recurringItems || [], today);
  const upcomingItems = getUpcomingItems(recurringItems || [], today);

  // Create day-by-day breakdown
  const dayBreakdown: DayBalance[] = [];
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // Group items by day
  const itemsByDay = new Map<number, RecurringItem[]>();
  upcomingItems.forEach(item => {
    if (item?.dayOfMonth && !itemsByDay.has(item.dayOfMonth)) {
      itemsByDay.set(item.dayOfMonth, []);
    }
    if (item?.dayOfMonth) {
      itemsByDay.get(item.dayOfMonth)?.push(item);
    }
  });

  // Create breakdown for remaining days
  for (let day = currentDay; day <= daysInMonth; day++) {
    const dayItems = itemsByDay.get(day) || [];
    const netChange = dayItems.reduce((sum, item) => {
      return sum + (item.type === 'income' ? (item.amount || 0) : -(item.amount || 0));
    }, 0);

    if (dayItems.length > 0) {
      dayBreakdown.push({
        day,
        netChange,
        items: dayItems
      });
    }
  }

  const renderDayBreakdown = ({ item }: { item: DayBalance }) => (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayDate}>{item.day}. des Monats</Text>
        <Text style={[
          styles.dayAmount,
          item.netChange >= 0 ? styles.positiveAmount : styles.negativeAmount
        ]}>
          {item.netChange >= 0 ? '+' : ''}{formatEUR(item.netChange)}
        </Text>
      </View>
      
      <View style={styles.dayItems}>
        {item.items.map(dayItem => (
          <View key={dayItem.id || Math.random().toString()} style={styles.dayItem}>
            <Text style={styles.dayItemName}>{dayItem.name || 'Unbekannter Posten'}</Text>
            <Text style={[
              styles.dayItemAmount,
              dayItem.type === 'income' ? styles.incomeText : styles.expenseText
            ]}>
              {dayItem.type === 'income' ? '+' : '-'}{formatEUR(dayItem.amount || 0)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const totalIncome = (recurringItems || [])
    .filter(item => item.type === 'income' && item.active)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalExpenses = (recurringItems || [])
    .filter(item => item.type === 'expense' && item.active)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Details & Breakdown</Text>
        <Text style={styles.headerSubtitle}>
          Detaillierte Übersicht
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Sofort verfügbar</Text>
            <Text style={styles.summaryAmount}>
              {formatEUR(calculation?.sofortVerfuegbar || 0)}
            </Text>
            <Text style={styles.summaryDetails}>
              Kontostand + Bargeld + Bekomme
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Monatsbilanz</Text>
            <Text style={[
              styles.summaryAmount,
              totalIncome - totalExpenses >= 0 ? styles.positiveAmount : styles.negativeAmount
            ]}>
              {formatEUR(totalIncome - totalExpenses)}
            </Text>
            <Text style={styles.summaryDetails}>
              Alle Einnahmen - Alle Ausgaben
            </Text>
          </View>
        </View>

        {/* Category Summary */}
        <View style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>Zusammenfassung der Kategorien</Text>
          
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>Verbleibende Einnahmen:</Text>
            <Text style={[styles.categoryAmount, styles.positiveAmount]}>
              +{formatEUR(calculation?.remainingIncome || 0)}
            </Text>
          </View>
          
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>Verbleibende Ausgaben:</Text>
            <Text style={[styles.categoryAmount, styles.negativeAmount]}>
              -{formatEUR(calculation?.remainingExpense || 0)}
            </Text>
          </View>
        </View>

        {/* Verfügbar bis Monatsende - Separate white card */}
        <View style={styles.monthEndCard}>
          <Text style={styles.monthEndTitle}>Verfügbar bis Monatsende</Text>
          <Text style={[
            styles.monthEndAmount,
            (calculation?.verfuegbarBisMonatsende || 0) >= 0 ? styles.positiveAmount : styles.negativeAmount
          ]}>
            {formatEUR(calculation?.verfuegbarBisMonatsende || 0)}
          </Text>
        </View>

        {/* Day-by-day breakdown */}
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Tagesaufschlüsselung</Text>
          <Text style={styles.breakdownSubtitle}>
            Verbleibende Tage in diesem Monat
          </Text>
          
          {dayBreakdown.length > 0 ? (
            <View>
              {dayBreakdown.map((item, index) => (
                <View key={item.day} style={styles.dayCard}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayDate}>{item.day}. des Monats</Text>
                    <Text style={[
                      styles.dayAmount,
                      item.netChange >= 0 ? styles.positiveAmount : styles.negativeAmount
                    ]}>
                      {item.netChange >= 0 ? '+' : ''}{formatEUR(item.netChange)}
                    </Text>
                  </View>
                  
                  <View style={styles.dayItems}>
                    {item.items.map(dayItem => (
                      <View key={dayItem.id || Math.random().toString()} style={styles.dayItem}>
                        <Text style={styles.dayItemName}>{dayItem.name || 'Unbekannter Posten'}</Text>
                        <Text style={[
                          styles.dayItemAmount,
                          dayItem.type === 'income' ? styles.incomeText : styles.expenseText
                        ]}>
                          {dayItem.type === 'income' ? '+' : '-'}{formatEUR(dayItem.amount || 0)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Keine bevorstehenden Posten in diesem Monat
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryDetails: {
    fontSize: 12,
    color: '#9ca3af',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#374151',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  monthEndCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  monthEndTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  monthEndAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  breakdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  breakdownSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dayAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  dayItems: {
    gap: 4,
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayItemName: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  dayItemAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#059669',
  },
  negativeAmount: {
    color: '#dc2626',
  },
  incomeText: {
    color: '#059669',
  },
  expenseText: {
    color: '#dc2626',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
