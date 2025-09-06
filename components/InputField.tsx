import React from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';
import { Typography } from './ui/Typography';
import { useThemeColors } from '@/hooks/useColorScheme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  suffix?: string;
}

export function InputField({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'decimal-pad',
  suffix
}: InputFieldProps) {
  const colors = useThemeColors();
  const focusAnim = new Animated.Value(0);
  
  const handleFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const handleBlur = () => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <View style={styles.container}>
      <Typography variant="caption" weight="medium" color="secondary" style={styles.label}>
        {label}
      </Typography>
      <Animated.View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.surface,
          borderColor: borderColor,
        }
      ]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          returnKeyType="done"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {suffix && (
          <Typography variant="body" weight="medium" color="tertiary" style={styles.suffix}>
            {suffix}
          </Typography>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontWeight: '500',
  },
  suffix: {
    paddingRight: 20,
  },
});