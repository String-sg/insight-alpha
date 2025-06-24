import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudio } from '@/hooks/useAudio';

interface AudioPlayerProps {
  className?: string;
  compact?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  className = '',
  compact = false 
}) => {
  const {
    isPlaying,
    currentPodcast,
    isLoading,
    getProgress,
    getFormattedCurrentTime,
    getFormattedDuration,
    playbackRate,
    volume,
    error,
    togglePlayPause,
    seekToPercentage,
    skipForward,
    skipBackward,
    cyclePlaybackRate,
    toggleMute,
    setVolume,
    canControl,
    getCurrentContentInfo,
  } = useAudio();

  if (!currentPodcast) {
    return null;
  }

  const contentInfo = getCurrentContentInfo();
  const progress = getProgress();

  if (compact) {
    return (
      <View className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 ${className}`}>
        <View className="flex-row items-center space-x-3">
          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={togglePlayPause}
            disabled={!canControl}
            className="w-10 h-10 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color="white"
              />
            )}
          </TouchableOpacity>

          {/* Content Info */}
          <View className="flex-1">
            <Text 
              className="text-sm font-medium text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              {contentInfo?.title}
            </Text>
            <Text 
              className="text-xs text-gray-500 dark:text-gray-400"
              numberOfLines={1}
            >
              {contentInfo?.subtitle}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="flex-1 mx-2">
            <Slider
              style={{ height: 20 }}
              minimumValue={0}
              maximumValue={100}
              value={progress}
              onSlidingComplete={(value: number) => seekToPercentage(value)}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#E5E7EB"
              thumbStyle={{ backgroundColor: '#3B82F6', width: 16, height: 16 }}
              disabled={!canControl}
            />
          </View>

          {/* Time */}
          <Text className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
            {getFormattedCurrentTime()}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 ${className}`}>
      {/* Error Display */}
      {error && (
        <View className="bg-red-100 dark:bg-red-900 px-3 py-2 rounded-lg mb-3">
          <Text className="text-red-800 dark:text-red-200 text-sm">{error}</Text>
        </View>
      )}

      {/* Content Info */}
      <View className="mb-4">
        <Text 
          className="text-lg font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          {contentInfo?.title}
        </Text>
        <Text 
          className="text-sm text-gray-600 dark:text-gray-400"
          numberOfLines={1}
        >
          {contentInfo?.subtitle}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <Slider
          style={{ height: 40 }}
          minimumValue={0}
          maximumValue={100}
          value={progress}
          onSlidingComplete={(value: number) => seekToPercentage(value)}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#E5E7EB"
          thumbStyle={{ backgroundColor: '#3B82F6', width: 20, height: 20 }}
          disabled={!canControl}
        />
        
        {/* Time Display */}
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {getFormattedCurrentTime()}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {getFormattedDuration()}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View className="flex-row items-center justify-center space-x-6">
        {/* Skip Backward */}
        <TouchableOpacity
          onPress={() => skipBackward(15)}
          disabled={!canControl}
          className="w-12 h-12 items-center justify-center disabled:opacity-50"
        >
          <Ionicons
            name="play-skip-back"
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          onPress={togglePlayPause}
          disabled={!canControl}
          className="w-16 h-16 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color="white"
            />
          )}
        </TouchableOpacity>

        {/* Skip Forward */}
        <TouchableOpacity
          onPress={() => skipForward(30)}
          disabled={!canControl}
          className="w-12 h-12 items-center justify-center disabled:opacity-50"
        >
          <Ionicons
            name="play-skip-forward"
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* Additional Controls */}
      <View className="flex-row items-center justify-between mt-4">
        {/* Playback Rate */}
        <TouchableOpacity
          onPress={cyclePlaybackRate}
          disabled={!canControl}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {playbackRate}x
          </Text>
        </TouchableOpacity>

        {/* Volume Control */}
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={toggleMute}
            disabled={!canControl}
            className="disabled:opacity-50"
          >
            <Ionicons
              name={(volume || 0) === 0 ? "volume-mute" : (volume || 0) < 0.5 ? "volume-low" : "volume-high"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
          
          <View className="w-20">
            <Slider
              style={{ height: 20 }}
              minimumValue={0}
              maximumValue={1}
              value={volume || 1.0}
              onSlidingComplete={(value: number) => setVolume(value)}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#E5E7EB"
              thumbStyle={{ backgroundColor: '#3B82F6', width: 12, height: 12 }}
              disabled={!canControl}
            />
          </View>
        </View>
      </View>
    </View>
  );
};