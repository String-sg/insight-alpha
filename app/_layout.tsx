import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  useFonts
} from '@expo-google-fonts/geist';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

// import { useColorScheme } from '@/hooks/useColorScheme'; // Disabled dark mode
import { MiniPlayer } from '@/components/MiniPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { NotesProvider } from '@/contexts/NotesContext';

function AppContent() {
  const pathname = usePathname();

  // Hide mini player when fullscreen player is active, on quiz pages, or on chat page
  const shouldShowMiniPlayer = pathname !== '/player' && !pathname.startsWith('/quiz') && pathname !== '/chat';

  return (
    <ThemeProvider value={DefaultTheme}>
      <View className={Platform.OS === 'web' ? "h-dvh" : "flex-1"}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="library" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="player" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="chat" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        
        {shouldShowMiniPlayer && <MiniPlayer />}
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // const colorScheme = useColorScheme(); // Disabled dark mode
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider className={Platform.OS === 'web' ? "h-dvh" : undefined}>
      <AudioProvider>
        <NotesProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </NotesProvider>
      </AudioProvider>
    </SafeAreaProvider>
  );
}
