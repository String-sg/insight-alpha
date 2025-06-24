import React from 'react';
import { ScrollView, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { SegmentedControl } from '@/components/SegmentedControl';
import { ProfileHeader } from '@/components/ProfileHeader';
import { useAudioContext } from '@/contexts/AudioContext';

export default function ExploreScreen() {
  const { currentPodcast } = useAudioContext();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        {/* Header */}
        <ProfileHeader />
        
        {/* Navigation Bar */}
        <SegmentedControl activeSegment="explore" />
        
        <View className="mx-6 mt-8">
          <Text className="text-black text-2xl font-semibold mb-4">
            Explore
          </Text>
          <Text className="text-slate-600 text-base">
            Discover new educational content and courses
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}