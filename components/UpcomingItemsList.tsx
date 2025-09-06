import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { Card } from './ui/Card';
import { Typography } from './ui/Typography';
import { RecurringItem } from '@/types/financial';
import { formatEUR } from '@/utils/formatUtils';
import { useThemeColors } from '@/hooks/useColorScheme';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react-native';

interface UpcomingItemsListProps {
  items: RecurringItem[];
}

export function UpcomingItemsList({ items }: UpcomingItemsListProps) {
  const colors = useThemeColors();
  
  const renderItem = ({ item }: { item: RecurringItem }) => (
    <Animated.View 
      entering={FadeInRight.delay(100).springify()}
      layout={Layout.springify()}
    >
      <View style={[styles.item, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.itemLeft}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: item.type === 'income' ? colors.income + '20' : colors.expense + '20' }
          ]}>
            {item.type === 'income' ? 
              <TrendingUp size={16} color={colors.income} /> :
              <TrendingDown size={16} color={colors.expense} />
            }
          </View>
          <View style={styles.itemInfo}>
            <Typography variant="body" weight="semibold">
              {item.name}
            </Typography>
            <View style={styles.dateContainer}>
              <Calendar size={12} color={colors.textMuted} />
              <Typography variant="caption" color="muted">
                {item.dayOfMonth}. des Monats
              </Typography>
            </View>
          </View>
        </View>
        <Typography 
          variant="body" 
          weight="bold"
          color={item.type === 'income' ? 'income' : 'expense'}
        >
          {item.type === 'income' ? '+' : '-'}{formatEUR(item.amount)}
        </Typography>
      </View>
    </Animated.View>
  );

  if (items.length === 0) {
    return (
      <Card>
        <Typography variant="h3" weight="bold" style={styles.title}>
          Bevorstehende Posten
        </Typography>
        <View style={styles.emptyContainer}>
          <Calendar size={48} color={colors.textMuted} />
          <Typography variant="body" color="muted" align="center" style={styles.emptyText}>
            Keine bevorstehenden Posten in diesem Monat
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Typography variant="h3" weight="bold" style={styles.title}>
        Bevorstehende Posten
      </Typography>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        scrollEnabled={false}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  list: {
    maxHeight: 280,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  emptyText: {
    marginTop: 8,
  },
});