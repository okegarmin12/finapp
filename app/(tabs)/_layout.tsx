import { Tabs } from 'expo-router';
import { Home, Calculator, Settings, TrendingUp } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colors = useThemeColors();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 68,
          elevation: 8,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Übersicht',
          tabBarIcon: ({ size, color }) => (
            <Home size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inputs"
        options={{
          title: 'Eingaben',
          tabBarIcon: ({ size, color }) => (
            <Calculator size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Posten',
          tabBarIcon: ({ size, color }) => (
            <Settings size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: 'Details',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}