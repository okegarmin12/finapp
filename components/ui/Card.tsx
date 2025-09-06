import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: number;
}

export function Card({ children, style, elevated = true, padding = 20 }: CardProps) {
  const colors = useThemeColors();
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
      shadowColor: colors.shadow,
      padding,
    },
    elevated && styles.elevated,
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginVertical: 8,
  },
  elevated: {
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
});