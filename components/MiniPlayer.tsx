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
import { BlurView } from 'expo-blur';
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
    // TODO: Implement AI chat functionality
    console.log('Chat with AI pressed');
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
          <View className="rounded-full overflow-hidden drop-shadow-lg">
            <BlurView
              intensity={95}
              tint="light"
              style={{ borderRadius: 1000 }}
            >
              <TouchableOpacity
                onPress={handlePlayerPress}
                activeOpacity={0.9}
                className="flex-row items-center p-3 bg-white/10 border border-white/20"
                style={{ borderRadius: 1000 }}
              >
                {/* Podcast Image */}
                <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-purple-500">
                  {contentInfo?.imageUrl ? (
                    <Image
                      source={{ uri: contentInfo.imageUrl }}
                      className="w-12 h-12"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Ionicons 
                        name="musical-notes" 
                        size={20} 
                        color="white" 
                      />
                    </View>
                  )}
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
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={24}
                      color="#666"
                      style={isPlaying ? {} : { marginLeft: 2 }}
                    />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>

        {/* AI Chat Button */}
        <View className="ml-2">
          <View className="w-18 h-18 rounded-full overflow-hidden drop-shadow-lg">
            <BlurView
              intensity={95}
              tint="light"
              style={{ 
                width: 72, 
                height: 72, 
                borderRadius: 36,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TouchableOpacity
                onPress={handleChatPress}
                activeOpacity={0.9}
                className="w-full h-full items-center justify-center bg-white/10 border border-white/20"
                style={{ borderRadius: 36 }}
              >
                <Ionicons
                  name="sparkles"
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};