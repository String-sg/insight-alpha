import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { educationalContent } from '@/data/educational-content';
import { mockQuizzes } from '@/data/quizzes';
import { EducationalContent } from '@/data/educational-content';
import { useAudio } from '@/hooks/useAudio';
import { useAudioContext } from '@/contexts/AudioContext';

export default function PodcastDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState(0);

  const {
    isContentPlaying,
    isCurrentPodcast,
    playContent,
    togglePlayPause,
    isLoading,
    isContentBuffering,
  } = useAudio();

  const { currentPodcast: currentlyPlayingPodcast } = useAudioContext();

  useEffect(() => {
    if (id) {
      const foundContent = educationalContent.find(c => c.id === id);
      setContent(foundContent || null);
    }
  }, [id]);

  const handlePlayPress = async () => {
    if (!content) return;

    if (isCurrentPodcast(content.id)) {
      await togglePlayPause();
    } else {
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
      await playContent(podcastFormat);
    }
  };

  const handleQuizPress = () => {
    if (!content) return;
    const quiz = mockQuizzes.find(q => q.podcastId === content.id);
    if (quiz) {
      router.push(`/quiz/${quiz.id}`);
    }
  };

  const handleDescriptionTextLayout = (event: any) => {
    setDescriptionLines(event.nativeEvent.lines.length);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const formatDuration = (duration: number) => {
    const totalSeconds = Math.floor(duration / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!content) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar barStyle="default" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            Content not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isThisPodcastCurrent = isCurrentPodcast(content.id);
  const isThisPodcastPlaying = isContentPlaying(content.id);
  const isThisPodcastLoading = isThisPodcastCurrent && (isLoading || isContentBuffering);
  const hasQuiz = mockQuizzes.some(q => q.podcastId === content.id);
  const shouldShowSeeMore = descriptionLines > 3 && !isDescriptionExpanded;
  
  // Check if mini player is visible (any podcast is currently loaded)
  const isMiniPlayerVisible = currentlyPlayingPodcast !== null;
  
  // Calculate dynamic padding for scroll content - match other screens
  const scrollPaddingBottom = isMiniPlayerVisible ? 120 : 40;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm"
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar barStyle="default" />
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
        >
          {/* Header Section */}
          <View className="px-6 pt-4 pb-6">
            {/* Content Cover */}
            <View className="items-center mb-6">
              <View className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-lg">
                <Image
                  source={{ uri: content.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Content Info */}
            <View className="items-center mb-8">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                {content.title}
              </Text>
              <Text className="text-lg text-gray-600 dark:text-gray-400 text-center mb-1">
                {content.author}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-500">
                {formatDuration(content.duration)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="space-y-4 mb-8">
              {/* Play Button */}
              <TouchableOpacity
                onPress={handlePlayPress}
                className={`w-full h-14 rounded-2xl flex-row items-center justify-center space-x-3 ${
                  isThisPodcastCurrent
                    ? 'bg-blue-500 dark:bg-blue-600'
                    : 'bg-blue-500 dark:bg-blue-600'
                }`}
                style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                activeOpacity={0.8}
              >
                {isThisPodcastLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons
                      name={isThisPodcastPlaying ? "pause" : "play"}
                      size={24}
                      color="white"
                    />
                    <Text className="text-white text-lg font-semibold">
                      {isThisPodcastCurrent
                        ? (isThisPodcastPlaying ? 'Pause' : 'Resume')
                        : 'Play Content'
                      }
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Take Quiz Button */}
              {hasQuiz && (
                <TouchableOpacity
                  onPress={handleQuizPress}
                  className="w-full h-12 rounded-2xl border-2 border-green-500 dark:border-green-400 flex-row items-center justify-center space-x-3 bg-green-50 dark:bg-green-900/20"
                  activeOpacity={0.8}
                >
                  <Text className="text-2xl">📝</Text>
                  <Text className="text-green-700 dark:text-green-400 text-lg font-semibold">
                    Take Quiz
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Description Section */}
          <View className="px-6">
            <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About this content
              </Text>
              
              <Text
                className="text-base text-gray-700 dark:text-gray-300 leading-6"
                numberOfLines={isDescriptionExpanded ? undefined : 3}
                onTextLayout={handleDescriptionTextLayout}
              >
                {content.description}
              </Text>

              {/* See More/Less Button */}
              {(shouldShowSeeMore || isDescriptionExpanded) && (
                <TouchableOpacity
                  onPress={toggleDescription}
                  className="mt-3 self-start"
                  activeOpacity={0.7}
                >
                  <Text className="text-blue-600 dark:text-blue-400 font-medium">
                    {isDescriptionExpanded ? 'See less' : 'See more'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Additional Info */}
          <View className="px-6 mt-6">
            <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content Details
              </Text>
              
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">Duration</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">
                    {formatDuration(content.duration)}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">Author</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">
                    {content.author}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">Category</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">
                    {content.category}
                  </Text>
                </View>

                {hasQuiz && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-400">Quiz Available</Text>
                    <Text className="text-green-600 dark:text-green-400 font-medium">
                      ✓ Yes
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}