import { useAudioContext } from '@/contexts/AudioContext';
import { BottomSheet } from '@/components/BottomSheet';
import { SourceSheet } from '@/components/SourceSheet';
import { educationalContent } from '@/data/educational-content';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, Upload, FileText, RotateCcw, RotateCw, Play, Pause, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    Share,
    Text,
    TouchableOpacity,
    View,
    Animated
} from 'react-native';

// Conditionally import MeshGradientView only for native platforms
let MeshGradientView: any = null;
if (Platform.OS !== 'web') {
  MeshGradientView = require('expo-mesh-gradient').MeshGradientView;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Web mesh gradient component using CSS approach
const WebMeshGradient = () => {
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create smooth animations for the gradients to match Figma design
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(animation1, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          }),
          Animated.timing(animation1, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animation2, {
            toValue: 1,
            duration: 12000,
            useNativeDriver: false,
          }),
          Animated.timing(animation2, {
            toValue: 0,
            duration: 12000,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animation3, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: false,
          }),
          Animated.timing(animation3, {
            toValue: 0,
            duration: 10000,
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();
  }, []);

  const translateX1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const translateY1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const scale2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const opacity3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0.9],
  });

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {/* Base smooth gradient */}
      <LinearGradient
        colors={['#FBBF24', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Large smooth blob 1 - Yellow/Orange */}
      <Animated.View
        style={{
          position: 'absolute',
          width: '200%',
          height: '150%',
          left: '-50%',
          top: '-25%',
          transform: [
            { translateX: translateX1 },
            { translateY: translateY1 },
          ],
        }}
      >
        <LinearGradient
          colors={['rgba(251, 191, 36, 0.8)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, borderRadius: 1000 }}
        />
      </Animated.View>
      
      {/* Large smooth blob 2 - Pink/Purple */}
      <Animated.View
        style={{
          position: 'absolute',
          width: '180%',
          height: '180%',
          right: '-40%',
          top: '20%',
          transform: [
            { scale: scale2 },
            { rotate: animation2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) },
          ],
          opacity: opacity3,
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(139, 92, 246, 0.6)', 'rgba(236, 72, 153, 0.5)', 'rgba(239, 68, 68, 0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, borderRadius: 1200 }}
        />
      </Animated.View>
      
      {/* Large smooth blob 3 - Blue base */}
      <Animated.View
        style={{
          position: 'absolute',
          width: '160%',
          height: '120%',
          left: '20%',
          bottom: '-20%',
          transform: [
            { translateX: animation3.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] }) },
            { translateY: animation1.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
          ],
        }}
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.7)', 'rgba(99, 102, 241, 0.5)', 'transparent']}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={{ flex: 1, borderRadius: 800 }}
        />
      </Animated.View>
      
      {/* Overlay for extra smoothness */}
      <LinearGradient
        colors={['rgba(251, 191, 36, 0.1)', 'transparent', 'rgba(59, 130, 246, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </View>
  );
};

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E9D5FF' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={{ marginTop: 16, color: '#7C3AED' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: SCREEN_HEIGHT }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: '#E9D5FF', overflow: 'hidden' }}>
        {/* Gradient Background */}
        {Platform.OS === 'web' ? (
          // Web animated mesh gradient
          <WebMeshGradient />
        ) : MeshGradientView ? (
          // Native smooth mesh gradient
          <MeshGradientView
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            columns={3}
            rows={3}
            colors={[
              '#FBBF24', '#F59E0B', '#EF4444',
              '#F59E0B', '#EF4444', '#EC4899',
              '#3B82F6', '#8B5CF6', '#6366F1'
            ]}
            points={[
              [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
              [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
              [0.0, 1.0], [0.5, 1.0], [1.0, 1.0]
            ]}
          />
        ) : (
          // Fallback gradient if MeshGradientView is not available
          <LinearGradient
            colors={['#E9D5FF', '#FBCFE8', '#FDE2E4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}

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
              thumbTintColor="#FFFFFF"
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