import { useAudioContext } from '@/contexts/AudioContext';
import { useChatContext } from '@/contexts/ChatContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';

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
    resumePodcast,
    pausePodcast,
  } = useAudioContext();

  const { showChat } = useChatContext();

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

  const handlePlayPause = async (e: any) => {
    e?.stopPropagation(); // Prevent triggering handlePlayerPress
    try {
      if (isPlaying) {
        await pausePodcast();
      } else {
        await resumePodcast();
      }
    } catch (error) {
      console.error('Failed to toggle playback from mini player:', error);
    }
  };

  const handlePlayerPress = () => {
    if (onPlayerPress) {
      onPlayerPress();
    } else {
      router.push('/player');
    }
  };

  const handleChatPress = () => {
    showChat();
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
      <View className="flex-row items-center px-2">
        {/* Main Mini Player */}
        <View className="flex-1 mr-1">
          <TouchableOpacity
            onPress={handlePlayerPress}
            activeOpacity={0.9}
            style={{
              borderRadius: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              borderWidth: 1,
              borderColor: 'rgba(221, 221, 221, 0.7)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 8,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* Inner shadow overlay for glass effect */}
            <View 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 1000,
                shadowColor: 'rgba(255, 255, 255, 0.25)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 1,
              }}
              pointerEvents="none"
            />
            
            {/* Podcast Image */}
            <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-purple-500">
              <Image
                source={require('@/assets/images/podcast-cover-1.png')}
                style={{ width: 48, height: 48 }}
                resizeMode="cover"
              />
            </View>

            {/* Content Info */}
            <View className="flex-1 mr-3">
              <Text 
                className="text-sm text-gray-900 font-geist-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {contentInfo?.title || 'Unknown Title'}
              </Text>
            </View>

            {/* Play/Pause Button */}
            <TouchableOpacity
              onPress={handlePlayPause}
              className="bg-gray-200 rounded-full p-3"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Icon
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="#666"
                  style={isPlaying ? {} : { marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* AI Chat Button */}
        <View className="ml-2">
          <TouchableOpacity
            onPress={handleChatPress}
            activeOpacity={0.9}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              borderWidth: 1,
              borderColor: 'rgba(221, 221, 221, 0.7)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Inner shadow overlay for glass effect */}
            <View 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 36,
                shadowColor: 'rgba(255, 255, 255, 0.25)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 1,
              }}
              pointerEvents="none"
            />
            
            <Icon
              name="sparkles"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};