import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useFrameworkReady();

  useEffect(() => {
    setStatusBarStyle(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}