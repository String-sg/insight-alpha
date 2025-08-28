import { useAudioContext } from '@/contexts/AudioContext';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';

interface MiniPlayerProps {
  onPlayerPress?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPlayerPress }) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(100)).current; // Start hidden below screen
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [forceBlurUpdate, setForceBlurUpdate] = useState(0);
  
  const {
    isPlaying,
    currentPodcast,
    currentEpisode,
    isLoading,
    resumePodcast,
    pausePodcast,
  } = useAudioContext();

  // Force backdrop blur on mount if podcast is already loaded (restored session)
  useEffect(() => {
    if (currentPodcast && Platform.OS === 'web') {
      // Force backdrop blur to be applied immediately for restored sessions
      const timer = setTimeout(() => {
        const elements = document.querySelectorAll('.mini-player-blur, [class*="mini-player-blur"]');
        elements.forEach((element: any) => {
          if (element) {
            element.style.backdropFilter = 'blur(10px)';
            element.style.webkitBackdropFilter = 'blur(10px)';
            // Force reflow
            element.offsetHeight;
          }
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPodcast]);

  // Show/hide animation based on whether audio is playing or loaded
  // Hide when on player screen
  const shouldShow = currentPodcast !== null && pathname !== '/player';

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
      ]).start(() => {
        // Force backdrop blur update after animation completes
        if (Platform.OS === 'web') {
          setForceBlurUpdate(prev => prev + 1);
        }
      });
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
    const category = currentPodcast?.category || '';
    console.log('[MiniPlayer] Current podcast:', currentPodcast);
    console.log('[MiniPlayer] Category being passed:', category);
    router.push({
      pathname: '/chat',
      params: { category }
    });
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

  // Use fixed positioning by default (web priority) with fallback for mobile
  const containerStyle = {
    position: Platform.OS === 'web' ? 'fixed' as any : 'absolute' as any,
    bottom: insets.bottom + 20,
    left: 0,
    right: 0,
    transform: [{ translateY: slideAnim }],
    opacity: opacityAnim,
    zIndex: 1000,
  };

  // Define blur style - apply everywhere for web priority with force update
  const blurStyle = {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    // Force style recalculation when forceBlurUpdate changes
    ...(Platform.OS === 'web' && forceBlurUpdate > 0 && {
      filter: `blur(0px)`, // This will be overridden by backdrop-filter
    }),
  } as any;

  return (
    <Animated.View
      style={containerStyle}
      className="mini-player-web"
    >
      <View className="max-w-3xl mx-auto w-full px-6">
        <View className="flex-row items-center">
        {/* Main Mini Player */}
        <View className="flex-1 mr-1">
          <TouchableWithoutFeedback
            onPress={handlePlayerPress}
          >
            <View 
              style={{
                borderRadius: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1,
                borderColor: 'rgba(226, 232, 240, 0.8)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 4.4,
                elevation: 8,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                ...(Platform.OS === 'web' && {
                  boxShadow: '0px 2px 2px 0px rgba(255, 255, 255, 0.40) inset, 0px 4px 12px 0px rgba(0, 0, 0, 0.10) inset, 0px 4px 4.4px 0px rgba(0, 0, 0, 0.05)',
                }),
                ...blurStyle,
              }}
            >
            {/* Podcast Image */}
            <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image
                source={(() => {
                  const category = currentPodcast?.category || '';
                  if (category === 'Special Educational Needs') {
                    return require('@/assets/images/sen.svg');
                  } else if (category === 'Artificial Intelligence') {
                    return require('@/assets/images/learnAI.svg');
                  } else if (category === 'Mental Health') {
                    return require('@/assets/images/chermentalh.svg');
                  } else {
                    return require('@/assets/images/cover-album.png');
                  }
                })()}
                style={{ width: 48, height: 48 }}
                resizeMode={(() => {
                  const category = currentPodcast?.category || '';
                  if (category === 'Special Educational Needs' || category === 'Artificial Intelligence' || category === 'Mental Health') {
                    return 'contain';
                  } else {
                    return 'cover';
                  }
                })()}
              />
            </View>

            {/* Content Info */}
            <View className="flex-1 mr-3">
              <Text 
                className="text-sm text-slate-900 font-geist-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {contentInfo?.title || 'Unknown Title'}
              </Text>
            </View>

            {/* Play/Pause Button */}
            <TouchableOpacity
              onPress={handlePlayPause}
              className="p-3"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Icon
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="#000000"
                  style={isPlaying ? {} : { marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* AI Chat Button */}
        <View className="ml-2">
          <TouchableWithoutFeedback
            onPress={handleChatPress}
          >
            <View 
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1,
                borderColor: 'rgba(226, 232, 240, 0.8)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 4.4,
                elevation: 8,
                alignItems: 'center',
                justifyContent: 'center',
                ...(Platform.OS === 'web' && {
                  boxShadow: '0px 2px 2px 0px rgba(255, 255, 255, 0.40) inset, 0px 4px 12px 0px rgba(0, 0, 0, 0.10) inset, 0px 4px 4.4px 0px rgba(0, 0, 0, 0.05)',
                }),
                ...blurStyle,
              }}
            >
            <Icon
              name="sparkles"
              size={24}
              color="#000000"
            />
            </View>
          </TouchableWithoutFeedback>
        </View>
        </View>
      </View>
    </Animated.View>
  );
};