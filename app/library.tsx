import { Icon } from '@/components/Icon';
import { ProfileHeader } from '@/components/ProfileHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { WebScrollView } from '@/components/WebScrollView';
import { useAudioContext } from '@/contexts/AudioContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { FlatList, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function LibraryScreen() {
  const { currentPodcast } = useAudioContext();
  const flatListRef = useRef<FlatList>(null);
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;
  
  // Card height for carousel snapping
  const cardHeight = 480 + 8; // Card height plus margin

  const learningSubjects = [
    {
      id: 'sen',
      title: 'SEN peer support',
      subtitle: 'Special Educational Needs',
      podcasts: 12,
      notes: 2,
      gradientFrom: '#6b21a8',
      gradientVia: '#a855f7',
      gradientTo: '#f048cd',
      badgeBg: 'bg-purple-200',
      badgeText: 'text-purple-900',
      textColor: 'text-white',
      icon: 'Moon',
      iconColor: '#ffffff',
    },
    {
      id: 'ai',
      title: 'Learn to use AI',
      subtitle: 'Artificial Intelligence',
      podcasts: 12,
      notes: 2,
      gradientFrom: '#fbbf24',
      gradientTo: '#fde047',
      badgeBg: 'bg-amber-200',
      badgeText: 'text-amber-900',
      textColor: 'text-black',
      icon: 'Sparkles',
      iconColor: '#ffffff',
    },
    {
      id: 'wellbeing',
      title: 'Understanding Mental Health',
      subtitle: 'Teacher mental health literacy',
      podcasts: 12,
      notes: 2,
      gradientFrom: '#2dd4bf',
      gradientTo: '#3b82f6',
      badgeBg: 'bg-teal-200',
      badgeText: 'text-teal-900',
      textColor: 'text-white',
      icon: 'Sun',
      iconColor: '#ffffff',
    }
  ];

  const renderCard = ({ item: subject }: { item: typeof learningSubjects[0] }) => (
    <View style={{ height: cardHeight }} className="mx-6 mb-2">
      <TouchableOpacity 
        className="flex-1"
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={subject.gradientVia 
            ? [subject.gradientFrom, subject.gradientVia, subject.gradientTo]
            : [subject.gradientFrom, subject.gradientTo]
          }
          locations={subject.gradientVia ? [0.08, 0.43, 1.19] : [0, 1]}
          className="flex-1 rounded-[32px] p-6"
          style={{ height: 480 }}
        >
          {/* Card content container */}
          <View className="flex-1 justify-between">
            {/* Icon area */}
            <View className="flex-1 items-center justify-center">
              <Icon 
                name={subject.icon as any}
                size={80} 
                color={subject.iconColor}
              />
            </View>
            
            {/* Content section */}
            <View className="gap-2">
              <View className="gap-1">
                {/* Badge */}
                <View className={`${subject.badgeBg} rounded-md px-2.5 py-0.5 self-start`}>
                  <Text className={`${subject.badgeText} font-geist-semibold text-xs`}>
                    {subject.subtitle}
                  </Text>
                </View>
                
                {/* Title */}
                <Text className={`${subject.textColor} font-geist-semibold text-xl leading-7`}>
                  {subject.title}
                </Text>
              </View>
              
              {/* Stats */}
              <Text className={`${subject.textColor} font-geist-regular text-sm leading-5`}>
                {subject.podcasts} podcasts{'\n'}{subject.notes} notes
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
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

  // Use WebScrollView for web, FlatList for native to maintain scroll snap behavior
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
      snapToInterval={cardHeight}
      decelerationRate="fast"
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      pagingEnabled={false}
      snapToAlignment="start"
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
