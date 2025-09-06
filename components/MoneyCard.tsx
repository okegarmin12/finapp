import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Card } from './ui/Card';
import { Typography } from './ui/Typography';
import { formatEUR } from '@/utils/formatUtils';
import { useThemeColors } from '@/hooks/useColorScheme';

interface MoneyCardProps {
  title: string;
  amount: number;
  type?: 'neutral' | 'positive' | 'negative';
  subtitle?: string;
  isPrimary?: boolean;
}

export function MoneyCard({ 
  title, 
  amount, 
  type = 'neutral', 
  subtitle,
  isPrimary = false 
}: MoneyCardProps) {
  const colors = useThemeColors();
  
  const getAmountColor = () => {
    switch (type) {
      case 'positive': return 'income' as const;
      case 'negative': return 'expense' as const;
      default: return 'primary' as const;
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(200).springify()}>
      <Card 
        style={[
          isPrimary && styles.primaryCard,
          isPrimary && { backgroundColor: colors.primary }
        ]}
        padding={isPrimary ? 32 : 20}
      >
        <Animated.View entering={FadeInDown.delay(300)}>
          <Typography 
            variant={isPrimary ? "overline" : "caption"} 
            color={isPrimary ? "primary" : "secondary"}
            weight="medium"
            style={isPrimary && { color: 'rgba(255, 255, 255, 0.8)' }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant={isPrimary ? "h1" : "h2"} 
            color={isPrimary ? "primary" : getAmountColor()}
            weight="bold"
            style={[
              styles.amount,
              isPrimary && { color: '#ffffff', marginVertical: 8 }
            ]}
          >
            {formatEUR(amount)}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="caption" 
              color={isPrimary ? "primary" : "tertiary"}
              style={isPrimary && { color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {subtitle}
            </Typography>
          )}
        </Animated.View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  primaryCard: {
    elevation: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  amount: {
    marginVertical: 4,
  },
});