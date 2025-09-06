import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MoneyCard } from '@/components/MoneyCard';
import { UpcomingItemsList } from '@/components/UpcomingItemsList';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useFinancialStore } from '@/store/useFinancialStore';
import { calcAvailable, getUpcomingItems } from '@/utils/calculations';
import { getCurrentDateBerlin } from '@/utils/dateUtils';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Calculator, Settings, Plus } from 'lucide-react-native';

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
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadData();
  }, []);

  const today = getSafeCurrentDate();
  const calculation = calcAvailable(inputs, recurringItems, today);
  const upcomingItems = getUpcomingItems(recurringItems, today);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <Animated.View entering={FadeInDown.delay(100)}>
            <Typography variant="overline" weight="medium" style={styles.headerOverline}>
              {formatDateSafely(today)}
            </Typography>
            <Typography variant="h2" weight="bold" style={styles.headerTitle}>
              Finanzplaner
            </Typography>
          </Animated.View>
        </LinearGradient>

        <ScrollView 
          style={[styles.content, { backgroundColor: colors.backgroundSecondary }]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.primaryCardContainer}>
            <MoneyCard
              title="Verfügbar bis Monatsende"
              amount={calculation.verfuegbarBisMonatsende}
              type={calculation.verfuegbarBisMonatsende >= 0 ? 'positive' : 'negative'}
              isPrimary={true}
            />
          </View>

          <View style={styles.statsContainer}>
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
          </View>

          <UpcomingItemsList items={upcomingItems} />

          <View style={styles.actionButtons}>
            <Button
              title="Eingaben"
              onPress={() => router.push('/inputs')}
              variant="secondary"
              icon={<Calculator size={20} color={colors.primary} />}
              style={styles.actionButton}
            />

            <Button
              title="Verwalten"
              onPress={() => router.push('/manage')}
              variant="secondary"
              icon={<Settings size={20} color={colors.primary} />}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
        
        {/* Floating Action Button */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          style={styles.fab}
        >
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/manage')}
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerOverline: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  primaryCardContainer: {
    marginBottom: 24,
  },
  statsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

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
