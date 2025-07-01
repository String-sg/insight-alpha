import { useAudioContext } from '@/contexts/AudioContext';
import { BottomSheet } from '@/components/BottomSheet';
import { SourceSheet } from '@/components/SourceSheet';
import { educationalContent } from '@/data/educational-content';
import Slider from '@react-native-community/slider';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, Upload, FileText, RotateCcw, RotateCw, Play, Pause, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Share,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height, width } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const [showSourceSheet, setShowSourceSheet] = useState(false);
  
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

  const handleShare = async () => {
    try {
      const contentInfo = getCurrentInfo();
      if (!contentInfo) return;

      const shareOptions = {
        message: `Check out this podcast: ${contentInfo.title}${contentInfo.subtitle ? ` by ${contentInfo.subtitle}` : ''}`,
        title: contentInfo.title,
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
  useEffect(() => {
    if (!currentPodcast) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  }, [currentPodcast, router]);

  const contentInfo = getCurrentInfo();
  const progress = getProgress();

  // Get sources from current podcast or educational content
  const sources = currentPodcast?.sources || 
    educationalContent.find(c => c.id === currentPodcast?.id)?.sources || 
    [];

  // Show loading if no podcast is available
  if (!currentPodcast) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-900">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="mt-4 text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-900 relative">
      <StatusBar style="light" />
      {/* Full screen video background - at container level */}
      <Video
        source={require('@/assets/video/bg-mesh-gradient.mov')}
        className="absolute inset-0"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: width,
          height: height,
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        positionMillis={0}
        rate={1.0}
        volume={0}
      />
      
      {/* Content wrapper with max width */}
      <View className="flex-1 relative z-10 mx-auto w-full px-4" style={{ maxWidth: 768 }}>

        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-12 pb-2">
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              }}
              className="w-10 h-10 items-center justify-center bg-black/20 rounded-full"
            >
              <X size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleShare}
              className="w-10 h-10 items-center justify-center bg-black/20 rounded-full"
            >
              <Upload size={18} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Error Display */}
          {error && (
            <View className="absolute top-20 left-6 right-6 bg-red-500/20 border border-red-500/30 rounded-xl p-3 z-20">
              <Text className="text-red-700 text-xs text-center">{error}</Text>
            </View>
          )}

          {/* Spacer for layout */}
          <View className="flex-1" />

          {/* Title Section */}
          <View className="px-6 mb-4">
            <View className="bg-purple-600 px-3 py-1.5 rounded-full self-start mb-3">
              <Text className="text-xs font-semibold text-white">Special Educational Needs</Text>
            </View>
            <Text className="text-2xl font-semibold text-white leading-8" numberOfLines={2}>
              {contentInfo?.title || 'Navigating Special Educational Needs in Singapore: A Path to Inclusion'}
            </Text>
          </View>

          {/* Progress Section */}
          <View className="px-6 mb-3">
            <Slider
              style={{ height: 30, width: '100%' }}
              minimumValue={0}
              maximumValue={100}
              value={progress}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#7C3AED"
              maximumTrackTintColor="#E9D5FF"
              // thumbTintColor="#FFFFFF"
            />
            
            {/* Time Display */}
            <View className="flex-row justify-between mt-2">
              <Text className="text-sm font-medium text-white">
                {formatTime(currentTime)}
              </Text>
              <Text className="text-sm font-medium text-white">
                -{formatTime(duration - currentTime)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View className="flex-row items-center justify-center px-6 mb-6 gap-6">
            {/* More Options */}
            <TouchableOpacity className="p-2">
              <MoreHorizontal size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>

            {/* Skip Backward */}
            <TouchableOpacity
              onPress={() => skipBackward(15)}
              className="p-2"
            >
              <RotateCcw size={28} color="white" strokeWidth={2} />
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              onPress={handlePlayPause}
              className="w-20 h-20 rounded-full bg-white items-center justify-center"
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                isPlaying ? (
                  <Pause size={24} color="#000" strokeWidth={2.5} />
                ) : (
                  <Play size={24} color="#000" strokeWidth={2.5} style={{ marginLeft: 2 }} />
                )
              )}
            </TouchableOpacity>

            {/* Skip Forward */}
            <TouchableOpacity
              onPress={() => skipForward(15)}
              className="p-2"
            >
              <RotateCw size={28} color="white" strokeWidth={2} />
            </TouchableOpacity>

            {/* Playback Rate */}
            <TouchableOpacity
              onPress={handlePlaybackRatePress}
              className="bg-white/20 px-3 py-2 rounded-xl"
            >
              <Text className="text-sm font-semibold text-white">
                {playbackRate}x
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View className="flex-row items-center justify-between px-6 pb-8">
            <View className="flex-row gap-4">
              <TouchableOpacity className="p-3">
                <ThumbsUp size={20} color="white" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity className="p-3">
                <ThumbsDown size={20} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => setShowSourceSheet(true)}
              className="bg-white/20 px-4 py-3 rounded-full flex-row items-center gap-2"
            >
              <FileText size={16} color="white" strokeWidth={2} />
              <Text className="text-sm font-semibold text-white">Sources</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* Source Bottom Sheet */}
      <BottomSheet
        visible={showSourceSheet}
        onClose={() => setShowSourceSheet(false)}
        height={490}
      >
        <SourceSheet 
          sources={sources} 
          onClose={() => setShowSourceSheet(false)}
        />
      </BottomSheet>
    </View>
  );
}