import React from 'react';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';
import { 
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  useFonts 
} from '@expo-google-fonts/geist';

// import { useColorScheme } from '@/hooks/useColorScheme'; // Disabled dark mode
import { AudioProvider } from '@/contexts/AudioContext';
import { NotesProvider } from '@/contexts/NotesContext';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { MiniPlayer } from '@/components/MiniPlayer';
import { ChatInterface } from '@/components/ChatInterface';
import { BottomSheet } from '@/components/BottomSheet';

function AppContent() {
  const pathname = usePathname();
  const { isChatVisible, hideChat } = useChatContext();

  // Hide mini player when fullscreen player is active or on quiz result page
  const shouldShowMiniPlayer = pathname !== '/player' && pathname !== '/quiz/result';

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="library" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="player" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        {shouldShowMiniPlayer && <MiniPlayer />}
        <StatusBar style="auto" />
        
        {/* Chat Bottom Sheet */}
        <BottomSheet
          visible={isChatVisible}
          onClose={hideChat}
          height={600}
        >
          <ChatInterface onClose={hideChat} />
        </BottomSheet>
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
    <SafeAreaProvider style={{ backgroundColor: 'transparent' }}>
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
