import { EducationalCard } from '@/components/EducationalCard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SegmentedControl } from '@/components/SegmentedControl';
import { WebScrollView } from '@/components/WebScrollView';
import { WeekCalendar } from '@/components/WeekCalendar';
import { EducationalContent, educationalContent, weeklyProgress } from '@/data/educational-content';
import { useAudio } from '@/hooks/useAudio';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';

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
      author: content.author,
      sources: content.sources,
      category: content.category
    };
    
    // Use the existing audio system
    await playContent(podcastFormat);
  };



  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  // Get recently learned content (filter by progress + include new AI content)
  const recentlyLearned = educationalContent.filter(content => 
    (content.progress && content.progress > 0 && content.progress < 1) || content.id === '6'
  );

  // Get daily recommendation (ADHD content)
  const dailyRecommendation = educationalContent.find(content => content.title.includes('ADHD')) || educationalContent[educationalContent.length - 1];

  const content = (
    <ProtectedRoute>
      <WebScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        <StatusBar barStyle="dark-content" />
          {/* Header */}
          <ProfileHeader />
        
        {/* Navigation Bar */}
        <View className="px-6">
          <SegmentedControl activeSegment="home" />
        </View>
        
        {/* Week Calendar */}
        <View className="px-6">
          <WeekCalendar weekData={weeklyProgress} />
        </View>
        
        {/* Recently Learned Section */}
        <View className="mt-8 mb-4">
          <View className="mx-6 mb-4">
            <Text className="text-black text-xl font-semibold">
              Recently learned
            </Text>
          </View>
          
          <View className="px-6">
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
        <View className="mt-4" style={{ marginBottom: bottomPadding }}>
          <View className="mx-6 mb-4">
            <Text className="text-black text-xl font-semibold">
              Recommended
            </Text>
          </View>
          
          <View className="px-6">
            <EducationalCard
              content={dailyRecommendation}
              onPress={() => handleContentPress(dailyRecommendation)}
              onPlayPress={() => handlePlayPress(dailyRecommendation)}
            />
          </View>
        </View>
      </WebScrollView>
    </ProtectedRoute>
  );

  if (Platform.OS === 'web') {
    return content;
  }

  return (
    <SafeAreaView className="flex-1">
      {content}
    </SafeAreaView>
  );
}

