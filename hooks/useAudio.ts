import { useCallback, useMemo } from 'react';
import { useAudioContext } from '@/contexts/AudioContext';
import { Podcast, Episode } from '@/types/podcast';

// Custom hook for convenient audio operations
export function useAudio() {
  const audioContext = useAudioContext();

  // Destructure context for easier access
  const {
    isPlaying,
    currentTime,
    duration,
    currentPodcast,
    currentEpisode,
    isLoading,
    playbackRate,
    volume,
    error,
    isBuffering,
    playPodcast,
    pausePodcast,
    resumePodcast,
    seekTo,
    setPlaybackRate,
    setVolume,
    skipForward,
    skipBackward,
    stopPodcast,
  } = audioContext;

  // Convenience function to toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pausePodcast();
    } else if (currentPodcast) {
      await resumePodcast();
    }
  }, [isPlaying, currentPodcast, pausePodcast, resumePodcast]);

  // Function to play a specific podcast or episode
  const playContent = useCallback(async (podcast: Podcast, episode?: Episode) => {
    await playPodcast(podcast, episode);
  }, [playPodcast]);

  // Function to check if a specific podcast is currently playing
  const isCurrentPodcast = useCallback((podcastId: string, episodeId?: string) => {
    if (!currentPodcast) return false;
    
    const podcastMatches = currentPodcast.id === podcastId;
    
    if (episodeId && currentEpisode) {
      return podcastMatches && currentEpisode.id === episodeId;
    }
    
    return podcastMatches && !currentEpisode;
  }, [currentPodcast, currentEpisode]);

  // Function to check if content is currently playing
  const isContentPlaying = useCallback((podcastId: string, episodeId?: string) => {
    return isCurrentPodcast(podcastId, episodeId) && isPlaying;
  }, [isCurrentPodcast, isPlaying]);

  // Function to get formatted current time
  const getFormattedCurrentTime = useCallback(() => {
    return formatTime(currentTime);
  }, [currentTime]);

  // Function to get formatted duration
  const getFormattedDuration = useCallback(() => {
    return formatTime(duration);
  }, [duration]);

  // Function to get progress percentage
  const getProgress = useCallback(() => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  // Function to get remaining time
  const getRemainingTime = useCallback(() => {
    return Math.max(0, duration - currentTime);
  }, [duration, currentTime]);

  // Function to get formatted remaining time
  const getFormattedRemainingTime = useCallback(() => {
    return formatTime(getRemainingTime());
  }, [getRemainingTime]);

  // Function to seek to percentage
  const seekToPercentage = useCallback(async (percentage: number) => {
    const position = Math.max(0, Math.min(duration, (percentage / 100) * duration));
    await seekTo(position);
  }, [duration, seekTo]);

  // Predefined playback rates
  const playbackRates = useMemo(() => [0.5, 0.75, 1.0, 1.25, 1.5, 2.0], []);

  // Function to cycle through playback rates
  const cyclePlaybackRate = useCallback(async () => {
    const currentIndex = playbackRates.indexOf(playbackRate || 1.0);
    const nextIndex = (currentIndex + 1) % playbackRates.length;
    await setPlaybackRate(playbackRates[nextIndex]);
  }, [playbackRate, playbackRates, setPlaybackRate]);

  // Function to set specific playback rate
  const setSpecificPlaybackRate = useCallback(async (rate: number) => {
    if (playbackRates.includes(rate)) {
      await setPlaybackRate(rate);
    }
  }, [playbackRates, setPlaybackRate]);

  // Function to adjust volume
  const adjustVolume = useCallback(async (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, (volume || 1.0) + delta));
    await setVolume(newVolume);
  }, [volume, setVolume]);

  // Function to mute/unmute
  const toggleMute = useCallback(async () => {
    if (volume === 0) {
      await setVolume(1.0);
    } else {
      await setVolume(0);
    }
  }, [volume, setVolume]);

  // Function to skip with custom intervals
  const skipForwardCustom = useCallback(async (seconds: number = 30) => {
    await skipForward(seconds);
  }, [skipForward]);

  const skipBackwardCustom = useCallback(async (seconds: number = 15) => {
    await skipBackward(seconds);
  }, [skipBackward]);

  // Function to check if audio can be controlled
  const canControl = useMemo(() => {
    return currentPodcast !== null && !isLoading;
  }, [currentPodcast, isLoading]);

  // Function to get current content info
  const getCurrentContentInfo = useCallback(() => {
    if (!currentPodcast) return null;

    return {
      title: currentEpisode?.title || currentPodcast.title,
      subtitle: currentEpisode ? currentPodcast.title : currentPodcast.author,
      imageUrl: currentEpisode?.imageUrl || currentPodcast.imageUrl,
      podcast: currentPodcast,
      episode: currentEpisode,
    };
  }, [currentPodcast, currentEpisode]);

  // Function to handle errors
  const clearError = useCallback(() => {
    // This would need to be implemented in the context
    // For now, we just expose the error state
  }, []);

  // Function to check if content is buffering
  const isContentBuffering = useMemo(() => {
    return isBuffering || isLoading;
  }, [isBuffering, isLoading]);

  return {
    // State
    isPlaying,
    currentTime,
    duration,
    currentPodcast,
    currentEpisode,
    isLoading,
    playbackRate,
    volume,
    error,
    isBuffering,
    
    // Basic controls
    playContent,
    togglePlayPause,
    pausePodcast,
    resumePodcast,
    stopPodcast,
    
    // Seeking
    seekTo,
    seekToPercentage,
    skipForward: skipForwardCustom,
    skipBackward: skipBackwardCustom,
    
    // Playback rate
    setPlaybackRate: setSpecificPlaybackRate,
    cyclePlaybackRate,
    playbackRates,
    
    // Volume
    setVolume,
    adjustVolume,
    toggleMute,
    
    // Utility functions
    isCurrentPodcast,
    isContentPlaying,
    getFormattedCurrentTime,
    getFormattedDuration,
    getFormattedRemainingTime,
    getProgress,
    getRemainingTime,
    canControl,
    getCurrentContentInfo,
    clearError,
    isContentBuffering,
  };
}

// Utility function to format time in milliseconds to MM:SS or HH:MM:SS
function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Hook for audio state only (without functions)
export function useAudioState() {
  const {
    isPlaying,
    currentTime,
    duration,
    currentPodcast,
    currentEpisode,
    isLoading,
    playbackRate,
    volume,
    error,
    isBuffering,
  } = useAudioContext();

  return {
    isPlaying,
    currentTime,
    duration,
    currentPodcast,
    currentEpisode,
    isLoading,
    playbackRate,
    volume,
    error,
    isBuffering,
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    formattedRemainingTime: formatTime(Math.max(0, duration - currentTime)),
  };
}

// Hook for audio controls only
export function useAudioControls() {
  const {
    playPodcast,
    pausePodcast,
    resumePodcast,
    seekTo,
    setPlaybackRate,
    setVolume,
    skipForward,
    skipBackward,
    stopPodcast,
  } = useAudioContext();

  return {
    playPodcast,
    pausePodcast,
    resumePodcast,
    seekTo,
    setPlaybackRate,
    setVolume,
    skipForward,
    skipBackward,
    stopPodcast,
  };
}