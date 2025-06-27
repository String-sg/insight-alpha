import { EducationalCard } from '@/components/EducationalCard';
import { Icon } from '@/components/Icon';
import { ProfileHeader } from '@/components/ProfileHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { WeekCalendar } from '@/components/WeekCalendar';
import { EducationalContent, educationalContent, weeklyProgress } from '@/data/educational-content';
import { useAudio } from '@/hooks/useAudio';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { currentPodcast, playContent } = useAudio();
  
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

  // Get recently learned content (filter by progress + include new AI content)
  const recentlyLearned = educationalContent.filter(content => 
    (content.progress && content.progress > 0 && content.progress < 1) || content.id === '6'
  );

  // Get daily recommendation (newest content - the AI one)
  const dailyRecommendation = educationalContent[educationalContent.length - 1]; // Latest added content

  return (
    <SafeAreaView className="flex-1 bg-[#f4f4f4]">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        {/* Header */}
        <ProfileHeader />
        
        {/* Navigation Bar */}
        <View className="px-4">
          <SegmentedControl activeSegment="home" />
        </View>
        
        {/* Week Calendar */}
        <View className="px-4">
          <WeekCalendar weekData={weeklyProgress} />
        </View>
        
        {/* Recently Learned Section */}
        <View className="mt-8 mb-4">
          <View className="flex-row items-center justify-between mx-4 mb-4">
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
          
          <View className="px-4">
            {recentlyLearned.map((content) => (
              <EducationalCard
                key={content.id}
                content={content}
                onPress={() => handleContentPress(content)}
                onPlayPress={() => handlePlayPress(content)}
              />
            ))}
          </View>
        </View>

        {/* Daily Recommendation Section */}
        <View className="mt-4 mb-8">
          <View className="flex-row items-center mx-4 mb-4">
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
              <Icon name="refresh" size={16} color="#09090b" />
            </TouchableOpacity>
          </View>
          
          <View className="px-4">
            <EducationalCard
              content={dailyRecommendation}
              onPress={() => handleContentPress(dailyRecommendation)}
              onPlayPress={() => handlePlayPress(dailyRecommendation)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

