import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MoneyCard } from '@/components/MoneyCard';
import { UpcomingItemsList } from '@/components/UpcomingItemsList';
import { useFinancialStore } from '@/store/useFinancialStore';
import { calcAvailable, getUpcomingItems } from '@/utils/calculations';
import { getCurrentDateBerlin } from '@/utils/dateUtils';
import { Calculator, Settings } from 'lucide-react-native';

// Sichere Datums-Funktion als Fallback
const getSafeCurrentDate = () => {
  try {
    // Versuche zuerst die ursprüngliche Funktion
    const berlinDate = getCurrentDateBerlin();
    
    // Prüfe ob das Date-Objekt gültig ist
    if (berlinDate && !isNaN(berlinDate.getTime())) {
      return berlinDate;
    }
  } catch (error) {
    console.warn('getCurrentDateBerlin failed:', error);
  }
  
  // Fallback: Erstelle ein sicheres Date-Objekt
  return new Date();
};

// Sichere Datums-Formatierung
const formatDateSafely = (date) => {
  try {
    // Prüfe ob das Date-Objekt gültig ist
    if (!date || isNaN(date.getTime())) {
      return new Date().toLocaleDateString('de-DE', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Date formatting failed:', error);
    // Letzter Fallback: Einfaches Format
    const now = new Date();
    return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  }
};

export default function OverviewScreen() {
  const router = useRouter();
  const { inputs, recurringItems, loadData } = useFinancialStore();

  useEffect(() => {
    loadData();
  }, []);

  const today = getSafeCurrentDate();
  const calculation = calcAvailable(inputs, recurringItems, today);
  const upcomingItems = getUpcomingItems(recurringItems, today);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finanzplaner</Text>
        <Text style={styles.headerSubtitle}>
          {formatDateSafely(today)}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MoneyCard
          title="Verfügbar bis Monatsende"
          amount={calculation.verfuegbarBisMonatsende}
          type={calculation.verfuegbarBisMonatsende >= 0 ? 'positive' : 'negative'}
        />

        <MoneyCard
          title="Verbleibende Einnahmen"
          amount={calculation.remainingIncome}
          type="positive"
          subtitle="In diesem Monat"
        />

        <MoneyCard
          title="Verbleibende Ausgaben"
          amount={calculation.remainingExpense}
          type="negative"
          subtitle="In diesem Monat"
        />

        <UpcomingItemsList items={upcomingItems} />

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => router.push('/inputs')}
          >
            <Calculator size={24} color="#2563eb" />
            <Text style={styles.actionButtonText}>Eingaben</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => router.push('/manage')}
          >
            <Settings size={24} color="#2563eb" />
            <Text style={styles.actionButtonText}>Posten verwalten</Text>
          </TouchableOpacity>
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
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 8,
  },
});
