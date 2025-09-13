import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { DateProvider } from '@/contexts/DateContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <UserProvider>
        <SettingsProvider>
          <DateProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </DateProvider>
        </SettingsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}