import { Icon } from '@/components/Icon';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useAudioContext } from '@/contexts/AudioContext';
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LibraryScreen() {
  const { currentPodcast } = useAudioContext();
  
  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  const learningSubjects = [
    {
      id: 'sen',
      title: 'Special Educational Needs (SEN)',
      podcasts: 12,
      notes: 2,
      color: 'bg-purple-500',
      iconBg: 'bg-purple-200',
      icon: 'accessibility',
      width: 'full'
    },
    {
      id: 'cce',
      title: 'Character and Citizenship Education (CCE)',
      podcasts: 12,
      notes: 2,
      color: 'bg-rose-500',
      iconBg: 'bg-rose-200',
      icon: 'people',
      width: 'half'
    },
    {
      id: 'inclusive',
      title: 'Inclusive Education',
      podcasts: 12,
      notes: 2,
      color: 'bg-amber-500',
      iconBg: 'bg-amber-200',
      icon: 'school',
      width: 'half'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f4f4f4]">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mx-4 mt-6 mb-4">
          <Text className="text-black text-2xl font-geist-semibold">
            Onward
          </Text>
          
          <TouchableOpacity className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden items-center justify-center">
            <View className="w-8 h-8">
              <Image
                source={{ uri: 'https://picsum.photos/32/32?random=profile' }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Navigation Bar */}
        <View className="px-4">
          <SegmentedControl activeSegment="learning" />
        </View>

        {/* Your learnings section */}
        <View className="flex-row items-center justify-between mx-4 mb-6">
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

        {/* Learning Subject Cards */}
        <View className="mx-4">
          {/* Full width card - SEN */}
          <TouchableOpacity 
            className={`${learningSubjects[0].color} rounded-3xl p-4 mb-4 h-[200px] justify-center`}
          >
            <View className={`${learningSubjects[0].iconBg} rounded-lg p-1 w-8 h-8 items-center justify-center mb-2`}>
              <Icon name={learningSubjects[0].icon as any} size={20} color="#3b0764" />
            </View>
            
            <Text className="text-white text-xl font-geist-semibold mb-2">
              {learningSubjects[0].title}
            </Text>
            
            <Text className="text-white text-sm font-geist-regular">
              {learningSubjects[0].podcasts} podcasts{'\n'}{learningSubjects[0].notes} notes
            </Text>
          </TouchableOpacity>

          {/* Half width cards - CCE and Inclusive Education */}
          <View className="flex-row gap-4">
            {learningSubjects.slice(1).map((subject, index) => (
              <TouchableOpacity 
                key={subject.id}
                className={`${subject.color} rounded-3xl p-4 flex-1`}
                style={{ minHeight: 200 }}
              >
                <View className={`${subject.iconBg} rounded-lg p-1 w-8 h-8 items-center justify-center mb-2`}>
                  <Icon 
                    name={subject.icon as any} 
                    size={20} 
                    color={subject.id === 'cce' ? '#4c0519' : '#451a03'} 
                  />
                </View>
                
                <Text className="text-white text-xl font-geist-semibold mb-2">
                  {subject.title}
                </Text>
                
                <Text className="text-white text-sm font-geist-regular">
                  {subject.podcasts} podcasts{'\n'}{subject.notes} notes
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
