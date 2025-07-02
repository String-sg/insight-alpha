import { ProfileHeader } from '@/components/ProfileHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { WebScrollView } from '@/components/WebScrollView';
import { TopicCard } from '@/components/TopicCard';
import { useAudioContext } from '@/contexts/AudioContext';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { educationalContent } from '@/data/educational-content';
import { Icon } from '@/components/Icon';

export default function ExploreScreen() {
  const { currentPodcast } = useAudioContext();
  const router = useRouter();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  // Map educational content to popular contents format
  const popularContents = educationalContent.map(content => ({
    id: content.id,
    title: content.title,
    category: content.category,
    badgeColor: content.badgeColor,
    textColor: content.textColor,
    author: content.author,
    publishedDate: content.publishedDate
  }));

  const content = (
    <WebScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
    >
      <StatusBar barStyle="dark-content" />
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <ProfileHeader />

      {/* Navigation Bar */}
      <View className="px-6 mb-6">
        <SegmentedControl activeSegment="explore" />
      </View>


      {/* Popular Contents Section */}
      <View className="mx-6 mb-10 mt-6">
        <Text className="text-black text-xl font-geist-semibold mb-4">
          Popular content today
        </Text>
        
        <View className="gap-3">
          {popularContents.map((content) => (
            <TouchableOpacity 
              key={content.id}
              className="bg-white rounded-3xl pt-6 pb-1 px-6"
              onPress={() => router.push(`/podcast/${content.id}`)}
              activeOpacity={0.8}
            >
              {/* Badges */}
              <View className="flex-row gap-1 mb-1">
                <View className={`${content.badgeColor} rounded-md px-2.5 py-0.5 h-[22px]`}>
                  <Text className={`${content.textColor} text-xs font-geist-semibold`}>
                    {content.category}
                  </Text>
                </View>
                <View className="bg-slate-200 rounded-md px-2.5 py-0.5 h-[22px]">
                  <Text className="text-black text-xs font-geist-semibold">
                    Podcast
                  </Text>
                </View>
              </View>
              
              {/* Title */}
              <Text className="text-slate-950 text-xl font-geist-medium leading-7" numberOfLines={1}>
                {content.title}
              </Text>
              
              {/* Metadata */}
              <View className="py-1.5">
                <Text className="text-slate-600 text-sm font-geist-regular">
                  {content.author} • {content.publishedDate}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Popular Topic Today Section */}
      <View className="mx-6">
        <Text className="text-black text-xl font-geist-semibold mb-4">
          Popular topic today
        </Text>
        
        <TopicCard
          id="ai-topic"
          title="Learn to use AI"
          subtitle="Artificial Intelligence"
          podcasts={12}
          gradientFrom="#fbbf24"
          gradientTo="#fde047"
          badgeBg="bg-amber-200"
          badgeText="text-amber-900"
          textColor="text-black"
          iconComponent={<Text className="text-white text-4xl">✦</Text>}
          showStats={true}
        />
      </View>
    </WebScrollView>
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