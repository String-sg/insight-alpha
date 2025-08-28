import { Icon } from '@/components/Icon';
import { NavigationBar } from '@/components/NavigationBar';
import { WebScrollView } from '@/components/WebScrollView';
import { useAudioContext } from '@/contexts/AudioContext';
import { educationalContent } from '@/data/educational-content';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Topic mapping
const topicMapping: Record<string, { 
  name: string;
  shortName: string;
  description: string;
  color: string; 
  badgeColor: string; 
  textColor: string 
}> = {
  'sen': { 
    name: 'Special Educational Needs',
    shortName: 'SEN peer support',
    description: 'Explore the world of Special Educational Needs (SEN) peer support that indicates Singapore specific peer support knowledges, case studies and more to gain knowledge about SEN. This topic encompasses a variety of bite-sized content including podcasts, interactive workshops, and expert-led webinars designed to empower educators and caregivers.',
    color: 'bg-purple-100',
    badgeColor: 'bg-purple-200',
    textColor: 'text-purple-900'
  },
  'ai': { 
    name: 'Artificial Intelligence',
    shortName: 'AI in Education',
    description: 'Discover how AI is transforming education through personalized learning, intelligent tutoring systems, and data-driven insights to enhance teaching effectiveness.',
    color: 'bg-yellow-100',
    badgeColor: 'bg-yellow-200',
    textColor: 'text-yellow-900'
  },
  'wellbeing': { 
    name: 'Teacher mental health literacy',
    shortName: 'Teacher Wellbeing',
    description: 'Learn essential skills for recognizing mental health challenges, supporting student wellbeing, and creating emotionally safe learning environments.',
    color: 'bg-teal-100',
    badgeColor: 'bg-teal-200',
    textColor: 'text-teal-900'
  }
};

export default function TopicPodcastsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentPodcast } = useAudioContext();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;
  
  // Get topic info
  const topicInfo = id ? topicMapping[id] : null;
  
  // Filter content by category
  const topicPodcasts = useMemo(() => {
    if (!topicInfo) return [];
    return educationalContent.filter(content => 
      content.category === topicInfo.name
    );
  }, [topicInfo]);


  const handlePodcastPress = (podcastId: string) => {
    router.push({
      pathname: `/podcast/${podcastId}`,
      params: { from: 'topic', topicId: id }
    });
  };

  if (!topicInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-slate-600">Topic not found</Text>
      </View>
    );
  }

  const content = (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      {/* Navigation Bar */}
      <NavigationBar 
        onBackPress={() => router.replace('/')}
        showUploadButton={false}
        title={topicInfo.shortName}
      />
      
      <WebScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 76, paddingBottom: bottomPadding }}
        className="flex-1"
      >

        {/* About This Topic Card */}
        <View className="px-6 mb-4">
          <View className="bg-slate-200 rounded-3xl p-4">
            <Text className="text-base font-semibold text-black mb-2">
              About this topic
            </Text>
            <Text className="text-base text-black leading-6">
              {topicInfo.description}
            </Text>
          </View>
        </View>

        {/* Podcast Count */}
        <View className="px-6 mb-3">
          <Text className="text-xl font-medium text-slate-950">
            {topicPodcasts.length} {topicPodcasts.length === 1 ? 'podcast' : 'podcasts'}
          </Text>
        </View>

      {/* Content */}
      {topicPodcasts.length === 0 ? (
        // Empty State
        <View className="flex-1 items-center justify-center px-6 py-20">
          <View className="bg-white rounded-3xl p-8 items-center">
            <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
              <Icon name="musical-notes-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-lg font-semibold text-slate-900 mb-2">
              Content coming soon
            </Text>
            <Text className="text-sm text-slate-600 text-center">
              We&apos;re working on adding more content for this topic. Check back later!
            </Text>
          </View>
        </View>
      ) : (
        // Podcast List
        <View className="px-6">
          {topicPodcasts.map((podcast) => {
            return (
              <TouchableOpacity
                key={podcast.id}
                onPress={() => handlePodcastPress(podcast.id)}
                className="bg-white rounded-3xl mb-4"
                activeOpacity={0.8}
              >
                <View className="pt-6 pb-4 px-6">
                  {/* Badges */}
                  <View className="flex-row gap-1 mb-2">
                    <View className={`${topicInfo.badgeColor} rounded-md px-2.5 py-0.5 h-[22px] justify-center`}>
                      <Text className={`${topicInfo.textColor} text-xs font-semibold`}>
                        {podcast.category}
                      </Text>
                    </View>
                    <View className="bg-slate-200 rounded-md px-2.5 py-0.5 h-[22px] justify-center">
                      <Text className="text-black text-xs font-semibold">
                        Podcast
                      </Text>
                    </View>
                  </View>
                  
                  {/* Title */}
                  <Text className="text-slate-950 text-xl font-medium leading-7 mb-1" numberOfLines={2}>
                    {podcast.title}
                  </Text>
                  
                  {/* Meta info */}
                  <Text className="text-slate-600 text-sm">
                    {podcast.author} • {podcast.publishedDate}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      </WebScrollView>
    </View>
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