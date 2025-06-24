import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useAudioContext } from '@/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';


export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const {
    isPlaying,
    currentPodcast,
    currentEpisode,
    isLoading,
    currentTime,
    duration,
    playbackRate,
    error,
    resumePodcast,
    pausePodcast,
    seekTo,
    skipForward,
    skipBackward,
    setPlaybackRate,
  } = useAudioContext();


  const handlePlayPause = async () => {
    if (isPlaying) {
      await pausePodcast();
    } else {
      await resumePodcast();
    }
  };

  const handleSeek = async (value: number) => {
    if (duration > 0) {
      const position = (value / 100) * duration;
      await seekTo(Math.max(0, Math.min(position, duration)));
    }
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

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4CB7FF', '#B875FF']}
        locations={[0, 0.865]}
className="absolute inset-0 flex-1"
        style={{ paddingTop: insets.top }}
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="share-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Error Display */}
          {error && (
            <View className="mx-6 mb-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <Text className="text-red-200 text-sm text-center">{error}</Text>
            </View>
          )}

          {/* Album Art */}
          <View className="items-center mb-8 mt-8">
            <View className="drop-shadow-2xl">
              {contentInfo?.imageUrl ? (
                <View className="w-76 h-76 rounded-[32px] overflow-hidden">
                  <Image
                    source={{ uri: contentInfo.imageUrl }}
                    className="w-76 h-76"
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View className="w-76 h-76 items-center justify-center bg-[#715EEE] rounded-[32px]">
                  <Ionicons name="musical-notes" size={120} color="#FFFFFF" />
                </View>
              )}
            </View>
          </View>

          {/* Title Section */}
          <View className="px-5 mb-8">
            <View className="bg-[#D4C3FF] px-2 py-1 rounded-full self-start mb-2">
              <Text className="text-xs font-semibold text-[#3C3256]">Special Educational Needs</Text>
            </View>
            <Text className="text-lg font-semibold text-[#F5EFF7] leading-7">
              {contentInfo?.title || 'Unknown Title'}
            </Text>
          </View>

          {/* Progress Section */}
          <View className="px-4 mb-8">
            <Slider
              style={{ height: 20, width: '100%' }}
              minimumValue={0}
              maximumValue={100}
              value={progress}
              onSlidingStart={() => {
                // Indicate we're seeking to prevent progress updates
              }}
              onSlidingComplete={(value: number) => handleSeek(value)}
              minimumTrackTintColor="#792AEF"
              maximumTrackTintColor="#F5EFF7"
              thumbStyle={{ 
                backgroundColor: '#FFFFFF', 
                width: 18, 
                height: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              }}
              trackStyle={{
                height: 8,
                borderRadius: 4,
              }}
            />
            
            {/* Time Display */}
            <View className="flex-row justify-between">
              <Text className="text-xs font-normal text-[#F5EFF7]">
                {formatTime(currentTime)}
              </Text>
              <Text className="text-xs font-normal text-[#F5EFF7]">
                -{formatTime(duration - currentTime)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View className="flex-row items-center justify-center px-4 mb-8 gap-8">
            {/* Subtitles */}
            <TouchableOpacity className="p-2">
              <Ionicons name="text" size={24} color="white" />
            </TouchableOpacity>

            {/* Skip Backward */}
            <TouchableOpacity
              onPress={() => skipBackward(15)}
              className="p-2"
            >
              <Ionicons name="play-skip-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              onPress={handlePlayPause}
              className="w-14 h-14 rounded-full bg-white/20 border border-white/30 items-center justify-center"
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="white"
                  style={isPlaying ? {} : { marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>

            {/* Skip Forward */}
            <TouchableOpacity
              onPress={() => skipForward(15)}
              className="p-2"
            >
              <Ionicons name="play-skip-forward" size={24} color="white" />
            </TouchableOpacity>

            {/* Playback Rate */}
            <TouchableOpacity
              onPress={handlePlaybackRatePress}
              className="bg-[#EADDFF]/10 px-3 py-1.5 rounded-xl"
            >
              <Text className="text-sm font-medium text-white">
                {playbackRate}x
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View className="flex-row items-center justify-between px-4">
            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-[#EADDFF]/50 px-3 py-3 rounded-full">
                <Ionicons name="thumbs-up-outline" size={20} color="#F5EFF7" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#EADDFF]/10 w-7 h-12 rounded-full items-center justify-center">
                <Ionicons name="thumbs-down-outline" size={20} color="#F5EFF7" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="bg-[#EADDFF]/10 px-3 py-3 rounded-full flex-row items-center gap-1">
              <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
              <Text className="text-sm font-medium text-white">Sources</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </LinearGradient>
    </>
  );
}

