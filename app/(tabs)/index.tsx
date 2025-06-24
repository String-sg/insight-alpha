import React from 'react';
import { FlatList, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Podcast } from '@/types/podcast';
import { mockPodcasts } from '@/data/podcasts';
import { PodcastCard } from '@/components/PodcastCard';

export default function HomeScreen() {
  const router = useRouter();
  
  const handlePodcastPress = (podcast: Podcast) => {
    router.push(`/podcast/${podcast.id}`);
  };

  const renderPodcastItem = ({ item }: { item: Podcast }) => (
    <PodcastCard 
      podcast={item} 
      onPress={() => handlePodcastPress(item)} 
    />
  );

  const renderHeader = () => (
    <View className="px-4 py-6 bg-white dark:bg-gray-900">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Discover Podcasts
      </Text>
      <Text className="text-base text-gray-600 dark:text-gray-400">
        Explore our curated collection of podcasts
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="default" />
      <View className="flex-1">
        <FlatList
          data={mockPodcasts}
          renderItem={renderPodcastItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          className="flex-1"
        />
      </View>
    </SafeAreaView>
  );
}

