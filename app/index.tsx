import React from 'react';
import { ScrollView, View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EducationalContent, educationalContent, weeklyProgress } from '@/data/educational-content';
import { EducationalCard } from '@/components/EducationalCard';
import { WeekCalendar } from '@/components/WeekCalendar';
import { ProfileHeader } from '@/components/ProfileHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useAudioContext } from '@/contexts/AudioContext';
import { useAudio } from '@/hooks/useAudio';

export default function HomeScreen() {
  const router = useRouter();
  const { currentPodcast } = useAudioContext();
  const { playContent } = useAudio();
  
  const handleContentPress = (content: EducationalContent) => {
    router.push(`/podcast/${content.id}`);
  };

  const handlePlayPress = async (content: EducationalContent) => {
    // Convert EducationalContent to Podcast format for audio system
    const podcastFormat = {
      id: content.id,
      title: content.title,
      description: content.description,
      imageUrl: content.imageUrl,
      audioUrl: content.audioUrl,
      duration: content.duration,
      author: content.author
    };
    
    // Use the existing audio system
    await playContent(podcastFormat);
  };

  const handleRefreshRecommendation = () => {
    // Handle refresh recommendation
    console.log('Refresh daily recommendation');
  };

  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  // Get recently learned content (filter by progress)
  const recentlyLearned = educationalContent.filter(content => 
    content.progress && content.progress > 0 && content.progress < 1
  );

  // Get daily recommendation (first item for now)
  const dailyRecommendation = educationalContent[1]; // Reflective Practice item

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        {/* Header */}
        <ProfileHeader />
        
        {/* Navigation Bar */}
        <SegmentedControl activeSegment="home" />
        
        {/* Week Calendar */}
        <WeekCalendar weekData={weeklyProgress} />
        
        {/* Recently Learned Section */}
        <View className="mt-8 mb-4">
          <View className="flex-row items-center justify-between mx-6 mb-4">
            <Text className="text-black text-xl font-semibold">
              Recently learned
            </Text>
            <TouchableOpacity
              className="px-3 py-1.5 rounded-full"
              activeOpacity={0.7}
            >
              <Text className="text-slate-900 text-sm font-medium tracking-wide">
                See all
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentlyLearned.map((content) => (
            <EducationalCard
              key={content.id}
              content={content}
              onPress={() => handleContentPress(content)}
              onPlayPress={() => handlePlayPress(content)}
            />
          ))}
        </View>

        {/* Daily Recommendation Section */}
        <View className="mt-4 mb-8">
          <View className="flex-row items-center mx-6 mb-4">
            <View className="flex-row items-center gap-1 flex-1">
              <Text className="text-black text-xl font-semibold">
                Daily recommendation
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleRefreshRecommendation}
              className="w-8 h-8 bg-white rounded-full items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color="#09090b" />
            </TouchableOpacity>
          </View>
          
          <EducationalCard
            content={dailyRecommendation}
            onPress={() => handleContentPress(dailyRecommendation)}
            onPlayPress={() => handlePlayPress(dailyRecommendation)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

