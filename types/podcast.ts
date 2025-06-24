/**
 * Core podcast data structures for the podcast player app
 */

export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // Duration in milliseconds
  author: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // Duration in milliseconds
  publishedAt: Date;
  podcastId: string; // Reference to parent podcast
  episodeNumber?: number;
  imageUrl?: string; // Episode-specific image, falls back to podcast image
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number; // Current position in milliseconds
  duration: number; // Total duration in milliseconds
  currentPodcast: Podcast | null;
  currentEpisode?: Episode | null;
  isLoading?: boolean;
  playbackRate?: number; // Playback speed (1.0 = normal, 1.5 = 1.5x speed, etc.)
  volume?: number; // Volume level (0.0 to 1.0)
}

export interface PlaylistItem {
  podcast?: Podcast;
  episode?: Episode;
  addedAt: Date;
}

export interface UserProgress {
  podcastId: string;
  episodeId?: string;
  currentTime: number; // Last known position in milliseconds
  completed: boolean;
  lastPlayedAt: Date;
}

export type AudioQuality = 'low' | 'medium' | 'high';

export interface AudioSettings {
  quality: AudioQuality;
  autoPlay: boolean;
  skipSilence: boolean;
  defaultPlaybackRate: number;
  downloadOverWifiOnly: boolean;
}