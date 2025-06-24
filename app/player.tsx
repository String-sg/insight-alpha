import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useAudioContext } from '@/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';
import { QuizProgress, QuizStatus } from '@/types/quiz';
import { mockQuizzes } from '@/data/quizzes';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);
  
  const {
    isPlaying,
    currentPodcast,
    currentEpisode,
    isLoading,
    currentTime,
    duration,
    playbackRate,
    volume,
    error,
    resumePodcast,
    pausePodcast,
    seekTo,
    skipForward,
    skipBackward,
    setPlaybackRate,
    setVolume,
    getQuizProgress,
  } = useAudioContext();

  useEffect(() => {
    if (currentPodcast) {
      loadQuizProgress();
    }
  }, [currentPodcast]);

  const loadQuizProgress = async () => {
    if (!currentPodcast) return;
    const quiz = mockQuizzes.find(q => q.podcastId === currentPodcast.id);
    if (quiz) {
      const progress = await getQuizProgress(currentPodcast.id);
      setQuizProgress(progress);
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pausePodcast();
    } else {
      await resumePodcast();
    }
  };

  const handleSeek = async (value: number) => {
    const position = (value / 100) * duration;
    await seekTo(position);
  };

  const handlePlaybackRatePress = async () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate || 1.0);
    const nextIndex = (currentIndex + 1) % rates.length;
    await setPlaybackRate(rates[nextIndex]);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!duration || duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  const getListeningProgress = () => {
    if (!duration || duration === 0) return 0;
    return currentTime / duration;
  };

  const getQuizStatus = (): QuizStatus => {
    if (!quizProgress) return 'unlocked'; // Quizzes are always available
    if (quizProgress.isCompleted) {
      return quizProgress.bestScore >= 70 ? 'passed' : 'completed';
    }
    return 'unlocked';
  };

  const handleQuizPress = () => {
    if (!currentPodcast) return;
    const quiz = mockQuizzes.find(q => q.podcastId === currentPodcast.id);
    if (quiz) {
      router.push(`/quiz/${quiz.id}`);
    }
  };

  const shouldShowQuizButton = () => {
    if (!currentPodcast) return false;
    const quiz = mockQuizzes.find(q => q.podcastId === currentPodcast.id);
    return !!quiz;
  };

  const getQuizButtonText = () => {
    const status = getQuizStatus();
    
    if (status === 'completed' || status === 'passed') {
      return `Retake Quiz (${quizProgress?.bestScore}%)`;
    }
    return 'Take Quiz';
  };

  const getCurrentInfo = () => {
    if (currentEpisode) {
      return {
        title: currentEpisode.title,
        subtitle: currentPodcast?.title || '',
        description: currentEpisode.description,
        imageUrl: currentEpisode.imageUrl || currentPodcast?.imageUrl || '',
      };
    } else if (currentPodcast) {
      return {
        title: currentPodcast.title,
        subtitle: currentPodcast.author,
        description: currentPodcast.description,
        imageUrl: currentPodcast.imageUrl,
      };
    }
    return null;
  };

  // Redirect if no audio is loaded
  if (!currentPodcast) {
    router.back();
    return null;
  }

  const contentInfo = getCurrentInfo();
  const progress = getProgress();
  const imageSize = Math.min(width * 0.8, height * 0.4);

  return (
    <>
      <StatusBar style="light" />
      <View 
        className="flex-1 bg-gray-900"
        style={{ paddingTop: insets.top }}
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/20"
            >
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
            
            <Text className="text-white font-medium text-lg flex-1 text-center mx-4">
              Now Playing
            </Text>
            
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-black/20">
              <Ionicons name="ellipsis-horizontal" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Error Display */}
          {error && (
            <View className="mx-6 mb-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <Text className="text-red-200 text-sm text-center">{error}</Text>
            </View>
          )}

          {/* Podcast Image */}
          <View className="items-center mb-8">
            <View 
              className="rounded-2xl overflow-hidden bg-gray-800 shadow-2xl"
              style={{
                width: imageSize,
                height: imageSize,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
              }}
            >
              {contentInfo?.imageUrl ? (
                <Image
                  source={{ uri: contentInfo.imageUrl }}
                  style={{ width: imageSize, height: imageSize }}
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Ionicons name="musical-notes" size={imageSize * 0.3} color="#6B7280" />
                </View>
              )}
            </View>
          </View>

          {/* Content Info */}
          <View className="px-6 mb-8">
            <Text className="text-white text-2xl font-bold text-center mb-2">
              {contentInfo?.title || 'Unknown Title'}
            </Text>
            <Text className="text-gray-300 text-lg text-center mb-4">
              {contentInfo?.subtitle || 'Unknown Author'}
            </Text>
            {contentInfo?.description && (
              <Text className="text-gray-400 text-sm text-center leading-5">
                {contentInfo.description}
              </Text>
            )}
          </View>

          {/* Progress Bar */}
          <View className="px-6 mb-8">
            <Slider
              style={{ height: 40 }}
              minimumValue={0}
              maximumValue={100}
              value={progress}
              onSlidingComplete={(value: number) => handleSeek(value)}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#374151"
              thumbStyle={{ 
                backgroundColor: '#3B82F6', 
                width: 20, 
                height: 20,
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.5)',
              }}
            />
            
            {/* Time Display */}
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-400 text-sm">
                {formatTime(currentTime)}
              </Text>
              <Text className="text-gray-400 text-sm">
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View className="flex-row items-center justify-center px-6 mb-8">
            {/* Skip Backward */}
            <TouchableOpacity
              onPress={() => skipBackward(15)}
              className="w-16 h-16 items-center justify-center"
            >
              <Ionicons name="play-skip-back" size={32} color="white" />
              <Text className="text-white text-xs mt-1">15s</Text>
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              onPress={handlePlayPause}
              className="w-20 h-20 items-center justify-center rounded-full bg-blue-500 mx-8"
              style={{
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={40}
                  color="white"
                  style={isPlaying ? {} : { marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>

            {/* Skip Forward */}
            <TouchableOpacity
              onPress={() => skipForward(30)}
              className="w-16 h-16 items-center justify-center"
            >
              <Ionicons name="play-skip-forward" size={32} color="white" />
              <Text className="text-white text-xs mt-1">30s</Text>
            </TouchableOpacity>
          </View>

          {/* Quiz Button */}
          {shouldShowQuizButton() && (
            <View className="px-6 mb-6">
              <TouchableOpacity
                onPress={handleQuizPress}
                className={`w-full p-4 rounded-xl border-2 flex-row items-center justify-center ${
                  getQuizStatus() === 'completed' || getQuizStatus() === 'passed'
                    ? 'bg-green-600/20 border-green-500'
                    : 'bg-blue-600/20 border-blue-500'
                }`}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">
                    {getQuizStatus() === 'completed' || getQuizStatus() === 'passed'
                      ? '✅'
                      : '📝'
                    }
                  </Text>
                  <View className="flex-1">
                    <Text className={`font-bold text-lg ${
                      getQuizStatus() === 'completed' || getQuizStatus() === 'passed'
                        ? 'text-green-400'
                        : 'text-blue-400'
                    }`}>
                      {getQuizButtonText()}
                    </Text>
                    {(getQuizStatus() === 'completed' || getQuizStatus() === 'passed') && quizProgress && (
                      <Text className="text-green-300 text-sm mt-1">
                        {quizProgress.attempts} attempt{quizProgress.attempts !== 1 ? 's' : ''} 
                        • Best: {quizProgress.bestScore}%
                      </Text>
                    )}
                    {getQuizStatus() === 'unlocked' && (
                      <Text className="text-blue-300 text-sm mt-1">
                        Test your knowledge of this podcast!
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Additional Controls */}
          <View className="flex-row items-center justify-between px-6">
            {/* Playback Rate */}
            <TouchableOpacity
              onPress={handlePlaybackRatePress}
              className="px-4 py-2 bg-gray-800 rounded-full border border-gray-600"
            >
              <Text className="text-white font-medium text-sm">
                {playbackRate}x
              </Text>
            </TouchableOpacity>

            {/* Volume Control */}
            <View className="flex-row items-center flex-1 ml-6">
              <Ionicons 
                name="volume-low" 
                size={20} 
                color="#9CA3AF" 
                style={{ marginRight: 12 }}
              />
              
              <View className="flex-1">
                <Slider
                  style={{ height: 30 }}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume || 1.0}
                  onSlidingComplete={(value: number) => setVolume(value)}
                  minimumTrackTintColor="#3B82F6"
                  maximumTrackTintColor="#374151"
                  thumbStyle={{ 
                    backgroundColor: '#3B82F6', 
                    width: 16, 
                    height: 16 
                  }}
                />
              </View>
              
              <Ionicons 
                name="volume-high" 
                size={20} 
                color="#9CA3AF" 
                style={{ marginLeft: 12 }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}