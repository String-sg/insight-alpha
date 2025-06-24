import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAudioContext } from '@/contexts/AudioContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { currentPodcast } = useAudioContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            // Add bottom margin when mini player is visible
            ...(currentPodcast && { marginBottom: 80 }),
          },
          default: {
            // Add bottom margin when mini player is visible on Android
            ...(currentPodcast && { marginBottom: 80 }),
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Podcasts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="waveform.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="books.vertical.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
