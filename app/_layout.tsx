import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  useFonts
} from '@expo-google-fonts/geist';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

// import { useColorScheme } from '@/hooks/useColorScheme'; // Disabled dark mode
import { MiniPlayer } from '@/components/MiniPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { NotesProvider } from '@/contexts/NotesContext';

// Custom transition configurations
const slideFromRightTransition = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const modalTransition = {
  presentation: 'modal' as const,
  cardStyleInterpolator: ({ current }: any) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1000, 0],
            }),
          },
        ],
        opacity: current.progress,
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
      },
    },
  },
};

const fadeTransition = {
  cardStyleInterpolator: ({ current }: any) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 200,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 150,
      },
    },
  },
};

function AppContent() {
  const pathname = usePathname();

  // Hide mini player when fullscreen player is active, on quiz pages, or on chat page
  const shouldShowMiniPlayer = pathname !== '/player' && !pathname.startsWith('/quiz') && pathname !== '/chat';

  return (
    <ThemeProvider value={DefaultTheme}>
      <View className={Platform.OS === 'web' ? "h-dvh" : "flex-1"}>
        <Stack
          screenOptions={{
            headerShown: false,
            ...slideFromRightTransition,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              ...fadeTransition,
            }} 
          />
          <Stack.Screen 
            name="library" 
            options={{ 
              headerShown: false,
              ...slideFromRightTransition,
            }} 
          />
          <Stack.Screen 
            name="explore" 
            options={{ 
              headerShown: false,
              ...slideFromRightTransition,
            }} 
          />
          <Stack.Screen 
            name="profile" 
            options={{ 
              headerShown: false,
              ...slideFromRightTransition,
            }} 
          />
          <Stack.Screen 
            name="player" 
            options={{ 
              headerShown: false,
              ...modalTransition,
            }} 
          />
          <Stack.Screen 
            name="chat" 
            options={{ 
              headerShown: false,
              ...modalTransition,
            }} 
          />
          <Stack.Screen 
            name="podcast/[id]" 
            options={{ 
              headerShown: false,
              ...slideFromRightTransition,
            }} 
          />
          <Stack.Screen 
            name="topic/[id]" 
            options={{ 
              headerShown: false,
              ...slideFromRightTransition,
            }} 
          />
          <Stack.Screen 
            name="quiz/[id]" 
            options={{ 
              headerShown: false,
              ...slideFromRightTransition,
            }} 
          />
          <Stack.Screen 
            name="quiz/result" 
            options={{ 
              headerShown: false,
              ...fadeTransition,
              gestureEnabled: false, // Prevent accidental dismissal of results
            }} 
          />
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
