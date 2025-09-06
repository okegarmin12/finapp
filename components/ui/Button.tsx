import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { Typography } from './Typography';
import { useThemeColors } from '@/hooks/useColorScheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  icon,
  style 
}: ButtonProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
    pressed.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    pressed.value = withTiming(0, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = (() => {
      switch (variant) {
        case 'primary':
          return interpolateColor(
            pressed.value,
            [0, 1],
            [colors.primary, colors.primaryDark]
          );
        case 'secondary':
          return interpolateColor(
            pressed.value,
            [0, 1],
            [colors.surface, colors.backgroundTertiary]
          );
        default:
          return colors.surface;
      }
    })();

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, { backgroundColor: colors.primary }];
      case 'secondary':
        return [...baseStyle, { 
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }];
      case 'outline':
        return [...baseStyle, { 
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        }];
      case 'ghost':
        return [...baseStyle, { backgroundColor: 'transparent' }];
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return '#ffffff';
      case 'outline': return colors.primary;
      default: return colors.text;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), animatedStyle, disabled && styles.disabled, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      <div style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon}
        <Typography 
          variant="body" 
          weight="semibold"
          style={{ color: getTextColor() }}
        >
          {title}
        </Typography>
      </div>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
  },
});