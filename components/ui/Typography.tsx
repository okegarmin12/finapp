import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'income' | 'expense';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}

export function Typography({ 
  children, 
  variant = 'body', 
  color = 'primary',
  weight = 'regular',
  align = 'left',
  style 
}: TypographyProps) {
  const colors = useThemeColors();
  
  const getTextColor = () => {
    switch (color) {
      case 'primary': return colors.text;
      case 'secondary': return colors.textSecondary;
      case 'tertiary': return colors.textTertiary;
      case 'muted': return colors.textMuted;
      case 'income': return colors.income;
      case 'expense': return colors.expense;
      default: return colors.text;
    }
  };

  const textStyle = [
    styles[variant],
    styles[weight],
    {
      color: getTextColor(),
      textAlign: align,
    },
    style,
  ];

  return <Text style={textStyle}>{children}</Text>;
}

const styles = StyleSheet.create({
  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Weights
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});