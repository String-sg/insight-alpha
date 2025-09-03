import { BottomSheet } from '@/components/BottomSheet';
import { Confetti } from '@/components/Confetti';
import { ShareDropdown } from '@/components/ShareDropdown';
import { SourceSheet } from '@/components/SourceSheet';
import { useAudioContext } from '@/contexts/AudioContext';
import { educationalContent } from '@/data/educational-content';
import { getScriptByPodcastId } from '@/data/scripts';
import Slider from '@react-native-community/slider';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FileText, MoreHorizontal, Pause, Play, RotateCcw, RotateCw, ScrollText, ThumbsDown, ThumbsUp, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function PlayerScreen() {
  const router = useRouter();
  const [showSourceSheet, setShowSourceSheet] = useState(false);
  const [showScriptSheet, setShowScriptSheet] = useState(false);

  const [likeStatus, setLikeStatus] = useState<'liked' | 'disliked' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { height } = useWindowDimensions(); // Dynamic dimensions
  const insets = useSafeAreaInsets(); // Add safe area awareness
  
  // Animation values
  const likeButtonScale = useSharedValue(1);
  const likeButtonRotation = useSharedValue(0);
  
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

      if (Platform.OS === 'web') {
        // Web platform handling
        const shareData = {
          title: contentInfo.title,
          text: `Check out this podcast: ${contentInfo.title}${contentInfo.subtitle ? ` by ${contentInfo.subtitle}` : ''}`,
          url: window.location.href
        };

        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback for web platforms without Web Share API
          alert('Sharing is not available on this platform.');
        }
      } else {
        // Use React Native Share for mobile platforms
        const shareOptions = {
          message: `Check out this podcast: ${contentInfo.title}${contentInfo.subtitle ? ` by ${contentInfo.subtitle}` : ''}`,
          title: contentInfo.title,
        };
        const result = await Share.share(shareOptions);
        
        // On Android, Share.share returns an object with action and activityType
        // On iOS, it returns an object with action
        // We don't need to handle the result unless there's an actual error
      }
    } catch (error: any) {
      console.error('Share error:', error);
      
      // Only show fallback for actual sharing not supported errors
      // Don't show error for user cancellation or other non-critical errors
      if (error?.message?.includes('not supported') || 
          error?.message?.includes('not available') ||
          error?.code === 'UNAVAILABLE') {
        alert('Sharing is not available on this platform.');
      }
      // For other errors (like user cancellation), silently ignore
    }
  };

  const handleLike = () => {
    const wasLiked = likeStatus === 'liked';
    setLikeStatus(wasLiked ? null : 'liked');
    
    if (!wasLiked) {
      // Trigger bouncy animation
      likeButtonScale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 200 }),
        withSpring(1, { damping: 3, stiffness: 300 })
      );
      
      likeButtonRotation.value = withSequence(
        withSpring(-10, { damping: 2, stiffness: 200 }),
        withSpring(10, { damping: 2, stiffness: 200 }),
        withSpring(0, { damping: 3, stiffness: 300 })
      );
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }
  };

  const handleDislike = () => {
    setLikeStatus(likeStatus === 'disliked' ? null : 'disliked');
  };
  
  const likeButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: likeButtonScale.value },
        { rotate: `${likeButtonRotation.value}deg` },
      ],
    };
  });

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
    // Get the latest data from educational content
    const educationalItem = currentPodcast ? educationalContent.find(c => c.id === currentPodcast.id) : null;
    
    if (currentEpisode) {
      return {
        title: currentEpisode.title,
        subtitle: currentPodcast?.title || '',
        description: currentEpisode.description,
        summary: educationalItem?.summary || '',
        imageUrl: currentEpisode.imageUrl || currentPodcast?.imageUrl || '',
      };
    } else if (currentPodcast) {
      return {
        title: currentPodcast.title,
        subtitle: currentPodcast.author,
        description: currentPodcast.description,
        summary: educationalItem?.summary || '',
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
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="mt-4 text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black relative">
      <StatusBar style="light" />
      {/* Full screen video background - at container level */}
      <Animated.View 
        className="absolute inset-0 bg-black overflow-hidden"
        entering={FadeIn.duration(800)}
      >
        <View style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: [{ translateX: -384 }], // Half of 768px
          width: 768,
          height: height,
        }}>
          <Video
            source={require('@/assets/video/bg-mesh-gradient.mp4')}
            style={{
              width: '100%',
              height: '100%',
            }}
            useNativeControls={false}
            resizeMode={ResizeMode.STRETCH}
            shouldPlay
            isLooping
            isMuted
            positionMillis={0}
            rate={1.0}
            volume={0}
          />
        </View>
      </Animated.View>
      
      {/* Content wrapper with max width */}
      <View className="flex-1 relative z-10 mx-auto w-full px-6" style={{ maxWidth: 768 }}>

        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between pt-8 pb-2" style={{ paddingTop: Math.max(8, insets.top + 8) }}>
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
            
            <ShareDropdown 
              contentInfo={contentInfo}
              script={currentPodcast ? getScriptByPodcastId(currentPodcast.id)?.content : undefined}
              sources={sources}
              onExamineSources={() => setShowSourceSheet(true)}
            />
          </View>

          {/* Error Display */}
          {error && (
            <View className="absolute top-20 left-6 right-6 bg-red-500/20 border border-red-500/30 rounded-xl p-3 z-20">
              <Text className="text-red-700 text-xs text-center">{error}</Text>
            </View>
          )}

          {/* Spacer for layout */}
          <View className="flex-1" />

          {/* Summary Section - Responsive & Scrollable */}
          {contentInfo?.summary && (
            <View className="flex-1 mb-4">
              <View className="bg-black/60 rounded-2xl p-3 backdrop-blur-sm h-full">
                <Text className="text-white text-lg font-semibold mb-2">
                  Key Learnings
                </Text>
                <ScrollView 
                  className="flex-1"
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{ paddingBottom: 4 }}
                >
                  <Text className="text-white/90 text-lg leading-6 font-medium">
                    {contentInfo.summary}
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}

          {/* Title Section */}
          <View className="mb-3">
            <View className="bg-purple-600 px-3 py-1.5 rounded-full self-start mb-2">
              <Text className="text-xs font-semibold text-white">Special Educational Needs</Text>
            </View>
            <Text className="text-xl font-semibold text-white leading-7" numberOfLines={2}>
              {contentInfo?.title || 'Navigating Special Educational Needs in Singapore: A Path to Inclusion'}
            </Text>
          </View>

          {/* Progress Section */}
          <View className="mb-3">
            <Slider
              style={{ height: 30, width: '100%' }}
              minimumValue={0}
              maximumValue={100}
              value={progress}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#7C3AED"
              maximumTrackTintColor="#E9D5FF"
              // @ts-ignore - thumbTintColor exists at runtime
              thumbTintColor="#ffffff"
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
          <View className="flex-row items-center justify-center mb-4 gap-6">
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
              className="bg-white/20 py-2 rounded-xl w-[56px] items-center justify-center"
            >
              <Text className="text-sm font-semibold text-white">
                {playbackRate}x
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View className="pb-8" style={{ paddingBottom: Math.max(8, insets.bottom + 8) }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 sm:gap-1 md:gap-2">
                <View style={{ position: 'relative' }}>
                  <AnimatedTouchableOpacity 
                    onPress={handleLike}
                    className="px-4 py-3 rounded-full flex-row items-center"
                    style={[
                      {
                        backgroundColor: likeStatus === 'liked' ? '#7C3AED' : 'rgba(255, 255, 255, 0.2)',
                      },
                      likeButtonAnimatedStyle
                    ]}
                  >
                    <ThumbsUp 
                      size={16} 
                      color="white" 
                      strokeWidth={2}
                    />
                  </AnimatedTouchableOpacity>
                  <Confetti isVisible={showConfetti} />
                </View>
                <TouchableOpacity 
                  onPress={handleDislike}
                  className="px-4 py-3 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: likeStatus === 'disliked' ? '#7C3AED' : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <ThumbsDown 
                    size={16} 
                    color="white" 
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-2 sm:gap-1 md:gap-2">
                <TouchableOpacity 
                  onPress={() => setShowScriptSheet(true)}
                  className="bg-white/20 px-4 py-3 rounded-full flex-row items-center gap-2"
                >
                  <ScrollText size={16} color="white" strokeWidth={2} />
                  <Text className="text-sm font-semibold text-white">Script</Text>
                </TouchableOpacity>
                
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
      


      {/* Script Bottom Sheet */}
      <BottomSheet
        visible={showScriptSheet}
        onClose={() => setShowScriptSheet(false)}
        height={800}
      >
        <View className="flex-1 px-6 py-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <View className="flex-1 mr-4">
              <Text className="text-black text-lg font-geist-medium">
                {contentInfo?.title || 'Script'}
              </Text>
              {contentInfo?.subtitle && (
                <Text className="text-slate-500 text-sm mt-1">
                  by {contentInfo.subtitle}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setShowScriptSheet(false)}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Text className="text-base text-black">×</Text>
            </TouchableOpacity>
          </View>
          
                      {/* Script Content */}
          {(() => {
            const script = currentPodcast ? getScriptByPodcastId(currentPodcast.id) : null;
            
            if (!script) {
              return (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-slate-500 text-center">
                    No script available for this podcast
                  </Text>
                </View>
              );
            }
            
            // Split script into sentences for highlighting
            const sentences = script.content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
            const totalSentences = sentences.length;
            
            // Calculate which sentence should be highlighted based on current time
            const progress = duration > 0 ? currentTime / duration : 0;
            const currentSentenceIndex = Math.floor(progress * totalSentences);
            const highlightedIndex = Math.min(currentSentenceIndex, totalSentences - 1);
            
            // Function to handle sentence click and seek to timestamp
            const handleSentenceClick = async (index: number) => {
              if (duration > 0) {
                const sentenceProgress = index / totalSentences;
                const targetTime = sentenceProgress * duration;
                await seekTo(targetTime);
                
                // Resume playback if currently paused
                if (!isPlaying) {
                  await resumePodcast();
                }
              }
            };
            
            return (
              <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {sentences.map((sentence, index) => {
                  const isHighlighted = isPlaying && index === highlightedIndex;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSentenceClick(index)}
                      activeOpacity={0.7}
                      className="mb-2"
                    >
                      <Text
                        className={`text-lg leading-7 text-justify ${
                          isHighlighted 
                            ? 'font-bold text-purple-700' 
                            : 'text-slate-700'
                        }`}
                        selectable
                      >
                        {sentence}
                        {index < sentences.length - 1 ? ' ' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            );
          })()}
        </View>
      </BottomSheet>
    </View>
  );
}