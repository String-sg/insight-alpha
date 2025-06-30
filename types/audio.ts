/**
 * Audio-related types and enums for expo-audio integration
 */

// Types for expo-audio - since expo-audio doesn't export comprehensive types,
// we define our own based on the actual API behavior
export interface AudioPlayerStatus {
  currentTime: number;
  duration: number;
  playing: boolean;
  volume: number;
  playbackRate: number;
  isLoaded: boolean;
}

export interface AudioSource {
  uri?: string;
  headers?: Record<string, string>;
}

export interface AudioPlayer {
  play(): void;
  pause(): void;
  seekTo(seconds: number): Promise<void>;
  replace(source: AudioSource): void;
  setPlaybackRate(rate: number, options?: { shouldCorrectPitch?: boolean }): void;
  remove(): void;
  // Properties
  id: number;
  currentTime: number;
  duration: number;
  playing: boolean;
  volume: number; // Read-only
  playbackRate: number;
  muted: boolean;
  loop: boolean;
  paused: boolean;
  isLoaded: boolean;
  isBuffering: boolean;
}

export interface AudioLoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AudioControlsState {
  canPlay: boolean;
  canPause: boolean;
  canSeek: boolean;
  canSkipForward: boolean;
  canSkipBackward: boolean;
}

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
  duration?: number;
}

export type PlaybackStatusUpdate = AudioPlayerStatus;

export interface SeekOptions {
  toleranceBefore?: number;
  toleranceAfter?: number;
}

export enum AudioFormat {
  MP3 = 'mp3',
  AAC = 'aac',
  WAV = 'wav',
  M4A = 'm4a',
}

export enum SkipDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
}

export interface SkipSettings {
  defaultSkipInterval: number; // in milliseconds (e.g., 15000 for 15 seconds)
  forwardSkipInterval?: number;
  backwardSkipInterval?: number;
}

export interface AudioBookmark {
  id: string;
  podcastId: string;
  episodeId?: string;
  timestamp: number; // in milliseconds
  title: string;
  createdAt: Date;
}

// Audio Context State Types
export interface AudioContextState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentPodcast: import('./podcast').Podcast | null;
  currentEpisode?: import('./podcast').Episode | null;
  isLoading: boolean;
  playbackRate: number;
  volume: number;
  error: string | null;
  isBuffering: boolean;
}

// Audio Control Function Types
export interface AudioControlFunctions {
  playPodcast: (podcast: import('./podcast').Podcast, episode?: import('./podcast').Episode) => Promise<void>;
  pausePodcast: () => Promise<void>;
  resumePodcast: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  skipForward: (seconds?: number) => Promise<void>;
  skipBackward: (seconds?: number) => Promise<void>;
  stopPodcast: () => Promise<void>;
}

// Audio Context Type
export interface AudioContextType extends AudioContextState, AudioControlFunctions {}

// Audio Hook Return Types
export interface AudioHookState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentPodcast: import('./podcast').Podcast | null;
  currentEpisode?: import('./podcast').Episode | null;
  isLoading: boolean;
  playbackRate: number;
  volume: number;
  error: string | null;
  isBuffering: boolean;
  progress: number;
  formattedCurrentTime: string;
  formattedDuration: string;
  formattedRemainingTime: string;
}

// Audio Event Types
export type AudioEventType = 
  | 'play'
  | 'pause'
  | 'stop'
  | 'seek'
  | 'rateChange'
  | 'volumeChange'
  | 'error'
  | 'loadStart'
  | 'loadEnd';

export interface AudioEvent {
  type: AudioEventType;
  timestamp: number;
  data?: any;
}

// Playback Speed Options
export type PlaybackSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 2.0;

// Audio Error Types
export enum AudioErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  DECODE_ERROR = 'DECODE_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AudioError {
  type: AudioErrorType;
  message: string;
  code?: string | number;
}