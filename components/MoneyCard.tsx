import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatEUR } from '@/utils/formatUtils';

interface MoneyCardProps {
  title: string;
  amount: number;
  type?: 'neutral' | 'positive' | 'negative';
  subtitle?: string;
}

export function MoneyCard({ title, amount, type = 'neutral', subtitle }: MoneyCardProps) {
  const getAmountColor = () => {
    switch (type) {
      case 'positive': return styles.positiveAmount;
      case 'negative': return styles.negativeAmount;
      default: return styles.neutralAmount;
    }
  };

  const getCardStyle = () => {
    if (title.includes('Verfügbar bis Monatsende')) {
      return [styles.card, styles.primaryCard];
    }
    return styles.card;
  };

  return (
    <View style={getCardStyle()}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, getAmountColor()]}>
        {formatEUR(amount)}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  primaryCard: {
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  neutralAmount: {
    color: '#111827',
  },
  positiveAmount: {
    color: '#059669',
  },
  negativeAmount: {
    color: '#dc2626',
  },
});