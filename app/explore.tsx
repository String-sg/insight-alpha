import { ProfileHeader } from '@/components/ProfileHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TopicCard } from '@/components/TopicCard';
import { WebScrollView } from '@/components/WebScrollView';
import { useAudioContext } from '@/contexts/AudioContext';
import { educationalContent } from '@/data/educational-content';
import { Stack, useRouter } from 'expo-router';
import { Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

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
  
  // Page transition hooks
  const { animatedStyle } = usePageTransition({ duration: 400 });
  const { getItemStyle } = useStaggeredTransition(popularContents.length + 3, { delay: 80 }); // Header + content sections

  const content = (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
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
        <Animated.View style={getItemStyle(0)}>
          <ProfileHeader />
        </Animated.View>

        {/* Navigation Bar */}
        <Animated.View style={getItemStyle(1)} className="px-6 mb-6">
          <SegmentedControl activeSegment="explore" />
        </Animated.View>

        {/* Popular Contents Section */}
        <Animated.View style={getItemStyle(2)} className="mx-6 mb-10 mt-6">
          <Text className="text-black text-xl font-geist-semibold mb-4">
            Popular content today
          </Text>
          
          <View className="gap-3">
            {popularContents.map((content, index) => (
              <Animated.View key={content.id} style={getItemStyle(3 + index)}>
                <TouchableOpacity 
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
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Popular Topic Today Section */}
        <Animated.View style={getItemStyle(3 + popularContents.length)} className="mx-6">
          <Text className="text-black text-xl font-geist-semibold mb-4">
            Popular topic today
          </Text>
          
          <TopicCard
            id="ai-topic"
            title="Learn to use AI"
            subtitle="Artificial Intelligent"
            podcasts={12}
            gradientFrom="#fbbf24"
            gradientTo="#fde047"
            badgeBg="bg-amber-200"
            badgeText="text-amber-900"
            textColor="text-black"
            iconComponent={<Text className="text-white text-4xl">✦</Text>}
            showStats={true}
          />
        </Animated.View>
      </WebScrollView>
    </Animated.View>
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