import { Icon } from '@/components/Icon';
import { ProfileHeader } from '@/components/ProfileHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useAudioContext } from '@/contexts/AudioContext';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const { currentPodcast } = useAudioContext();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  // Popular creators data
  const popularCreators = [
    {
      id: 'ast',
      name: 'Academy of Singapore Teachers',
      badge: { text: 'MOE', color: 'bg-red-500' },
      logo: require('@/assets/images/astlogo1 1.png')
    },
    {
      id: 'ted',
      name: 'TED',
      badge: { text: 'Spotify', icon: 'musical-note', color: 'bg-emerald-400' },
      logo: require('@/assets/images/TED_three_letter_logo.svg 1.png')
    },
    {
      id: 'harvard',
      name: 'Harvard Business School',
      badge: { text: 'Spotify', icon: 'musical-note', color: 'bg-emerald-400' },
      logo: require('@/assets/images/Harvard_Business_School_shield_logo.svg 1.png')
    }
  ];

  // Popular topics data
  const popularTopics = [
    {
      id: 'sen',
      title: 'Special Educational Needs (SEN)',
      podcasts: 12,
      notes: 2,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'inclusive',
      title: 'Inclusive Education',
      podcasts: 12,
      notes: 2,
      gradient: 'from-fuchsia-500 to-pink-500'
    }
  ];

  // Popular contents data
  const popularContents = [
    {
      id: 'resilience',
      title: 'Building Resilience in Children through SEL',
      badges: [
        { text: 'Social Emotional Learning Activities', color: 'bg-pink-200', textColor: 'text-pink-900' },
        { text: 'Workshop', color: 'bg-slate-950', textColor: 'text-slate-50' }
      ],
      source: 'Community Center',
      timeAgo: '2 weeks ago'
    },
    {
      id: 'assessment',
      title: 'Evaluating Student Performance with Modern Assessment Strategies',
      badges: [
        { text: 'Assessment Tools', color: 'bg-pink-200', textColor: 'text-pink-900' },
        { text: 'Conference', color: 'bg-slate-950', textColor: 'text-slate-50' }
      ],
      source: 'National Education Summit',
      timeAgo: '3 days ago'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        {/* Header */}
        <ProfileHeader />

        {/* Navigation Bar */}
        <View className="px-6">
          <SegmentedControl activeSegment="explore" />
        </View>


        {/* Popular Topics Section */}
        <View className="mx-6 mb-6">
          <Text className="text-black text-xl font-geist-semibold mb-4">
            Popular topics
          </Text>
          
          <View className="flex-row gap-4">
            {popularTopics.map((topic) => (
              <TouchableOpacity 
                key={topic.id}
                className={`flex-1 h-[182px] rounded-3xl p-4 justify-center bg-gradient-to-br ${topic.gradient}`}
              >
                <Text className="text-white text-xl font-geist-semibold mb-2">
                  {topic.title}
                </Text>
                
                <Text className="text-white text-sm font-geist-regular">
                  {topic.podcasts} podcasts{'\n'}{topic.notes} notes
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Contents Section */}
        <View className="mx-6">
          <Text className="text-black text-xl font-geist-semibold mb-4">
            Popular contents
          </Text>
          
          <View className="gap-3">
            {popularContents.map((content) => (
              <TouchableOpacity 
                key={content.id}
                className="bg-pink-100 rounded-3xl p-6 shadow-sm"
              >
                {/* Badges */}
                <View className="flex-row gap-1 mb-1">
                  {content.badges.map((badge, index) => (
                    <View 
                      key={index}
                      className={`${badge.color} rounded-md px-2.5 py-0.5`}
                    >
                      <Text className={`${badge.textColor} text-xs font-geist-semibold`}>
                        {badge.text}
                      </Text>
                    </View>
                  ))}
                </View>
                
                {/* Title */}
                <Text className="text-slate-950 text-xl font-geist-medium leading-7 mb-1">
                  {content.title}
                </Text>
                
                {/* Metadata */}
                <Text className="text-slate-600 text-sm font-geist-regular">
                  {content.source} • {content.timeAgo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}