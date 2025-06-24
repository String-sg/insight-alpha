import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAudioContext } from '@/contexts/AudioContext';

interface MiniPlayerProps {
  onPlayerPress?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPlayerPress }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(100)).current; // Start hidden below screen
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  const {
    isPlaying,
    currentPodcast,
    currentEpisode,
    isLoading,
    currentTime,
    duration,
    resumePodcast,
    pausePodcast,
  } = useAudioContext();

  // Show/hide animation based on whether audio is playing or loaded
  const shouldShow = currentPodcast !== null;

  useEffect(() => {
    if (shouldShow) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Slide down and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [shouldShow, slideAnim, opacityAnim]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pausePodcast();
    } else {
      await resumePodcast();
    }
  };

  const handlePlayerPress = () => {
    if (onPlayerPress) {
      onPlayerPress();
    } else {
      router.push('/player');
    }
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
        imageUrl: currentEpisode.imageUrl || currentPodcast?.imageUrl || '',
      };
    } else if (currentPodcast) {
      return {
        title: currentPodcast.title,
        subtitle: currentPodcast.author,
        imageUrl: currentPodcast.imageUrl,
      };
    }
    return null;
  };

  if (!shouldShow) {
    return null;
  }

  const contentInfo = getCurrentInfo();
  const progress = getProgress();

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 20,
        left: 0,
        right: 0,
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
        zIndex: 1000,
      }}
    >
      <TouchableOpacity
        onPress={handlePlayerPress}
        activeOpacity={0.9}
        className="mx-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          elevation: 5,
        }}
      >
        {/* Progress Bar */}
        <View className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 rounded-t-xl overflow-hidden">
          <View 
            className="h-full bg-blue-500 dark:bg-blue-400"
            style={{ width: `${progress}%` }}
          />
        </View>

        <View className="flex-row items-center p-3 pt-4">
          {/* Podcast Image */}
          <View className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-gray-200 dark:bg-gray-600">
            {contentInfo?.imageUrl ? (
              <Image
                source={{ uri: contentInfo.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons 
                  name="musical-notes" 
                  size={20} 
                  color="#9CA3AF" 
                />
              </View>
            )}
          </View>

          {/* Content Info */}
          <View className="flex-1 mr-3">
            <Text 
              className="text-sm font-semibold text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              {contentInfo?.title || 'Unknown Title'}
            </Text>
            <Text 
              className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
              numberOfLines={1}
            >
              {contentInfo?.subtitle || 'Unknown Author'}
            </Text>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={handlePlayPause}
            className="w-10 h-10 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600"
            style={{
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
              elevation: 3,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={18}
                color="white"
                style={isPlaying ? {} : { marginLeft: 2 }} // Adjust play icon position
              />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};