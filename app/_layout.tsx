import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';

// import { useColorScheme } from '@/hooks/useColorScheme'; // Disabled dark mode
import { AudioProvider } from '@/contexts/AudioContext';
import { MiniPlayer } from '@/components/MiniPlayer';

export default function RootLayout() {
  // const colorScheme = useColorScheme(); // Disabled dark mode
  const pathname = usePathname();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Hide mini player when fullscreen player is active
  const shouldShowMiniPlayer = pathname !== '/player';

  return (
    <SafeAreaProvider style={{ backgroundColor: 'transparent' }}>
      <AudioProvider>
        <ThemeProvider value={DefaultTheme}>
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="library" options={{ headerShown: false }} />
              <Stack.Screen name="player" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            {shouldShowMiniPlayer && <MiniPlayer />}
            <StatusBar style="auto" />
          </View>
        </ThemeProvider>
      </AudioProvider>
    </SafeAreaProvider>
  );
}
