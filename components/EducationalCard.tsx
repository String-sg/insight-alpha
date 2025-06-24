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
    isContentBuffering 
  } = useAudio();

  const isThisPodcastCurrent = isCurrentPodcast(content.id);
  const isThisPodcastPlaying = isContentPlaying(content.id);
  const isThisPodcastLoading = isThisPodcastCurrent && (isLoading || isContentBuffering);

  const handlePlayPress = (e: any) => {
    e.stopPropagation();
    if (onPlayPress) {
      onPlayPress();
    }
  };

  const renderProgressRing = () => {
    const progress = content.progress || 0;
    // const circumference = 2 * Math.PI * 8; // radius = 8 - unused for now
    // const strokeDasharray = circumference;
    // const strokeDashoffset = circumference - (progress * circumference);

    return (
      <View className="w-6 h-6 items-center justify-center">
        <View className="w-6 h-6 transform -rotate-90">
          <View className="absolute inset-0 w-6 h-6 rounded-full border-2 border-slate-200" />
          <View 
            className={`absolute inset-0 w-6 h-6 rounded-full border-2 ${
              content.backgroundColor === 'bg-purple-100' ? 'border-purple-600' : 'border-indigo-600'
            }`}
            style={{
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [{ rotate: `${progress * 360}deg` }]
            }}
          />
        </View>
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
            <Text className={`${content.textColor} text-xs font-semibold`}>
              {content.category}
            </Text>
          </View>
          
          {/* Title */}
          <Text className="text-slate-950 text-xl font-medium leading-7 mt-1">
            {content.title}
          </Text>
          
          {/* Author and Date */}
          <View className="flex-row items-center py-1.5 mt-1">
            <Text className="text-slate-600 text-sm font-normal">
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
            <Text className="text-black text-sm font-medium">
              {isThisPodcastLoading
                ? 'Loading...'
                : isThisPodcastCurrent
                ? isThisPodcastPlaying
                  ? 'Pause'
                  : 'Resume'
                : 'Play'}
            </Text>
          </TouchableOpacity>
          
          {/* Progress and Time */}
          <View className="flex-row items-center gap-2">
            {renderProgressRing()}
            <Text className="text-slate-600 text-sm font-normal">
              {content.timeLeft}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};