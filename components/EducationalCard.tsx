import { EducationalContent } from '@/data/educational-content';
import { useAudio } from '@/hooks/useAudio';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface EducationalCardProps {
  content: EducationalContent;
  onPress?: () => void;
  onPlayPress?: () => void;
}

export const EducationalCard: React.FC<EducationalCardProps> = ({ 
  content, 
  onPress,
  onPlayPress 
}) => {
  const { 
    isContentPlaying, 
    isCurrentPodcast, 
    togglePlayPause, 
    isLoading,
    isContentBuffering,
    getFormattedRemainingTime,
    getProgress,
    currentTime,
    duration 
  } = useAudio();

  const isThisPodcastCurrent = isCurrentPodcast(content.id);
  const isThisPodcastPlaying = isContentPlaying(content.id);
  const isThisPodcastLoading = isThisPodcastCurrent && (isLoading || isContentBuffering);

  // Helper function to get actual progress for this content
  const getActualProgress = () => {
    if (isThisPodcastCurrent && duration > 0) {
      // Use live progress from audio player
      return getProgress() / 100; // Convert percentage to 0-1 range
    }
    // Fall back to static progress from content data
    return content.progress || 0;
  };

  // Helper function to get actual remaining time for this content
  const getActualTimeLeft = () => {
    if (isThisPodcastCurrent && duration > 0) {
      // Use live remaining time from audio player and add "left" suffix
      const remainingTime = getFormattedRemainingTime();
      return remainingTime ? `${remainingTime} left` : content.timeLeft;
    }
    
    // Calculate remaining time based on content duration and progress
    const progress = content.progress || 0;
    const totalDurationMs = content.duration;
    
    // If no progress (unplayed), show total duration
    if (progress === 0) {
      const totalMinutes = Math.floor(totalDurationMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      
      if (hours > 0) {
        const remainingMinutes = totalMinutes % 60;
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${totalMinutes}m`;
    }
    
    const remainingMs = totalDurationMs * (1 - progress);
    
    // Format remaining time
    const totalMinutes = Math.floor(remainingMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    
    if (totalMinutes <= 0) {
      return 'Completed';
    }
    
    if (hours > 0) {
      const remainingMinutes = totalMinutes % 60;
      return `${hours}h ${remainingMinutes}m left`;
    }
    return `${totalMinutes}m left`;
  };

  const handlePlayPress = (e: any) => {
    e.stopPropagation();
    if (onPlayPress) {
      onPlayPress();
    }
  };

  const renderProgressRing = () => {
    const progress = getActualProgress();
    const progressPercentage = Math.min(100, Math.max(0, progress * 100)); // Ensure 0-100 range
    
    // Get the background color class and convert to actual color for inner circle
    const getInnerCircleColor = () => {
      switch (content.backgroundColor) {
        case 'bg-green-100':
          return '#dcfce7'; // green-100
        case 'bg-purple-100':
          return '#f3e8ff'; // purple-100
        case 'bg-blue-100':
          return '#dbeafe'; // blue-100
        case 'bg-yellow-100':
          return '#fef3c7'; // yellow-100
        case 'bg-pink-100':
          return '#fce7f3'; // pink-100
        case 'bg-indigo-100':
          return '#e0e7ff'; // indigo-100
        default:
          return '#f1f5f9'; // slate-100 as fallback
      }
    };

    return (
      <View className="w-6 h-6 relative">
        {/* Background donut ring */}
        <View className="w-6 h-6 rounded-full border-2 border-slate-200" />
        
        {/* Progress overlay - starts from 12 o'clock */}
        <View className="absolute inset-0 w-6 h-6 rounded-full overflow-hidden transform -rotate-90">
          {/* First half progress (0-50%) */}
          <View 
            className="absolute right-0 top-0 w-3 h-6 origin-left"
            style={{
              backgroundColor: progressPercentage > 0 ? '#000000' : 'transparent',
              transform: [
                { 
                  rotate: `${Math.min(progressPercentage * 3.6, 180)}deg` 
                }
              ],
            }}
          />
          
          {/* Second half progress (50-100%) */}
          {progressPercentage > 50 && (
            <View 
              className="absolute left-0 top-0 w-3 h-6 origin-right bg-black"
              style={{
                transform: [
                  { 
                    rotate: `${Math.min((progressPercentage - 50) * 3.6, 180)}deg` 
                  }
                ],
              }}
            />
          )}
        </View>
        
        {/* Inner circle to create donut hole - matches card background */}
        <View 
          className="absolute inset-1 w-4 h-4 rounded-full"
          style={{ backgroundColor: getInnerCircleColor() }}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${content.backgroundColor} rounded-3xl drop-shadow-sm mx-6 mb-4`}
      activeOpacity={0.8}
    >
      {/* Header Section */}
      <View className="pt-6 pb-1 px-6">
        <View className="flex-col gap-1">
          {/* Category Badge */}
          <View className={`${content.badgeColor} self-start rounded-md px-2.5 py-0.5`}>
            <Text className={`${content.textColor} text-xs font-geist-semibold`}>
              {content.category}
            </Text>
          </View>
          
          {/* Title */}
          <Text className="text-slate-950 text-xl font-geist-medium leading-7 mt-1">
            {content.title}
          </Text>
          
          {/* Author and Date */}
          <View className="flex-row items-center py-1.5 mt-1">
            <Text className="text-slate-600 text-sm font-geist">
              {content.author} • {content.publishedDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Section */}
      <View className="px-4 pb-4">
        <View className="flex-row items-center gap-3">
          {/* Play Button */}
          <TouchableOpacity
            onPress={handlePlayPress}
            className="bg-white rounded-full px-5 py-3 flex-row items-center gap-1 drop-shadow-sm border border-black/10"
            activeOpacity={0.8}
          >
            {isThisPodcastLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Ionicons 
                name={isThisPodcastPlaying ? "pause" : "play"} 
                size={16} 
                color="#000000" 
              />
            )}
            <Text className="text-black text-sm font-geist-medium">
              {isThisPodcastLoading
                ? 'Loading...'
                : isThisPodcastCurrent
                ? isThisPodcastPlaying
                  ? 'Pause'
                  : 'Resume'
                : (content.progress && content.progress > 0) ? 'Resume' : 'Play'}
            </Text>
          </TouchableOpacity>
          
          {/* Progress and Time */}
          <View className="flex-row items-center gap-2">
            {renderProgressRing()}
            <Text className="text-slate-600 text-sm font-geist">
              {getActualTimeLeft()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};