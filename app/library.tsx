import { Icon } from '@/components/Icon';
import { ProfileHeader } from '@/components/ProfileHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { WebScrollView } from '@/components/WebScrollView';
import { TopicCard } from '@/components/TopicCard';
import { useAudioContext } from '@/contexts/AudioContext';
import { educationalContent } from '@/data/educational-content';
import { useRouter } from 'expo-router';
import React, { useRef, useMemo } from 'react';
import { FlatList, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function LibraryScreen() {
  const { currentPodcast } = useAudioContext();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;
  
  // Card height for carousel snapping
  const cardHeight = 480 + 8; // Card height plus margin

  // Calculate actual content counts for each topic
  const contentCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Special Educational Needs': educationalContent.filter(c => c.category === 'Special Educational Needs').length,
      'Artificial Intelligent': educationalContent.filter(c => c.category === 'Artificial Intelligent').length,
      'Teacher mental health literacy': educationalContent.filter(c => c.category === 'Teacher mental health literacy').length,
    };
    return counts;
  }, []);

  const learningSubjects = [
    {
      id: 'sen',
      title: 'SEN peer support',
      subtitle: 'Special Educational Needs',
      podcasts: contentCounts['Special Educational Needs'] || 0,
      notes: 2,
      gradientFrom: '#6b21a8',
      gradientVia: '#a855f7',
      gradientTo: '#f048cd',
      badgeBg: 'bg-purple-200',
      badgeText: 'text-purple-900',
      textColor: 'text-white',
      icon: require('@/assets/icon/icon-sen.svg'),
    },
    {
      id: 'ai',
      title: 'Learn to use AI',
      subtitle: 'Artificial Intelligence',
      podcasts: contentCounts['Artificial Intelligent'] || 0,
      notes: 2,
      gradientFrom: '#fbbf24',
      gradientTo: '#fde047',
      badgeBg: 'bg-amber-200',
      badgeText: 'text-amber-900',
      textColor: 'text-black',
      icon: require('@/assets/icon/icon-learnai.svg'),
    },
    {
      id: 'wellbeing',
      title: 'Understanding Mental Health',
      subtitle: 'Teacher mental health literacy',
      podcasts: contentCounts['Teacher mental health literacy'] || 0,
      notes: 2,
      gradientFrom: '#2dd4bf',
      gradientTo: '#3b82f6',
      badgeBg: 'bg-teal-200',
      badgeText: 'text-teal-900',
      textColor: 'text-white',
      icon: require('@/assets/icon/icon-mentalhealth.svg'),
    }
  ];

  const renderCard = ({ item: subject }: { item: typeof learningSubjects[0] }) => (
    <View style={{ height: cardHeight }} className="mx-6 mb-2">
      <TopicCard 
        {...subject} 
        onPress={() => router.push(`/topic/${subject.id}`)}
      />
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <ProfileHeader />

      {/* Navigation Bar */}
      <View className="px-6">
        <SegmentedControl activeSegment="learning" />
      </View>

      {/* Your learnings section */}
      <View className="flex-row items-center justify-between mx-6 mb-6">
        <Text className="text-black text-xl font-geist-semibold">
          Your learnings
        </Text>
        
        <View className="flex-row gap-4">
          <TouchableOpacity className="w-12 h-14 bg-slate-100 rounded-2xl items-center justify-center">
            <Icon name="settings-outline" size={24} color="#020617" />
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-14 bg-slate-100 rounded-2xl items-center justify-center">
            <Icon name="funnel-outline" size={24} color="#020617" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // Use WebScrollView for web, FlatList for native
  const content = Platform.OS === 'web' ? (
    <WebScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader()}
      <View style={{ marginBottom: bottomPadding }}>
        {learningSubjects.map((subject) => (
          <React.Fragment key={subject.id}>
            {renderCard({ item: subject })}
          </React.Fragment>
        ))}
      </View>
    </WebScrollView>
  ) : (
    <FlatList
      ref={flatListRef}
      data={learningSubjects}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
    />
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
