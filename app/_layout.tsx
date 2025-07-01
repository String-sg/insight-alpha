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
import { BottomSheet } from '@/components/BottomSheet';
import { ChatInterface } from '@/components/ChatInterface';
import { MiniPlayer } from '@/components/MiniPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { NotesProvider } from '@/contexts/NotesContext';

function AppContent() {
  const pathname = usePathname();
  const { isChatVisible, hideChat } = useChatContext();

  // Hide mini player when fullscreen player is active or on quiz pages
  const shouldShowMiniPlayer = pathname !== '/player' && !pathname.startsWith('/quiz');

  const webContainerStyle = Platform.OS === 'web' ? {
    width: '100%' as any,
  } : {
    flex: 1,
  };

  const webRootStyle = Platform.OS === 'web' ? {
    backgroundColor: '#f5f5f5',
    width: '100%' as any,
    minHeight: '100dvh' as any,
    display: 'flex' as any,
    flexDirection: 'column' as any,
  } : {
    flex: 1,
    backgroundColor: '#f5f5f5'
  };

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={webRootStyle}>
        <View className="max-w-3xl mx-auto w-full" style={webContainerStyle}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="library" options={{ headerShown: false }} />
            <Stack.Screen name="explore" options={{ headerShown: false }} />
            <Stack.Screen name="player" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
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

  const safeAreaStyle = Platform.OS === 'web' ? {
    backgroundColor: '#f5f5f5',
    width: '100%' as any,
  } : {
    backgroundColor: '#f5f5f5'
  };

  return (
    <SafeAreaProvider style={safeAreaStyle}>
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
