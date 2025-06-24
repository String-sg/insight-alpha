import { mockQuizzes } from '@/data/quizzes';
import { AudioPlayer, AudioPlayerStatus } from '@/types/audio';
import { Episode, PlaybackState, Podcast } from '@/types/podcast';
import { QuizProgress } from '@/types/quiz';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer } from 'expo-audio';
import React, { createContext, ReactNode, useContext, useEffect, useReducer, useRef } from 'react';

// Audio context state interface
interface AudioContextState extends PlaybackState {
  error: string | null;
  player: AudioPlayer | null;
  isBuffering: boolean;
  playerStatus: AudioPlayerStatus | null;
}

// Audio context actions
type AudioAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PLAYER'; payload: AudioPlayer | null }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_CURRENT_PODCAST'; payload: Podcast | null }
  | { type: 'SET_CURRENT_EPISODE'; payload: Episode | null }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_PLAYER_STATUS'; payload: AudioPlayerStatus | null }
  | { type: 'RESET_PLAYBACK' };

// Audio context functions interface
interface AudioContextFunctions {
  playPodcast: (podcast: Podcast, episode?: Episode) => Promise<void>;
  pausePodcast: () => Promise<void>;
  resumePodcast: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  skipForward: (seconds?: number) => Promise<void>;
  skipBackward: (seconds?: number) => Promise<void>;
  stopPodcast: () => Promise<void>;
  getQuizProgress: (podcastId: string) => Promise<QuizProgress | null>;
  initializeQuizAvailability: (podcastId: string) => Promise<void>;
}

// Combined context interface
interface AudioContextType extends AudioContextState, AudioContextFunctions {}

// Initial state
const initialState: AudioContextState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  currentPodcast: null,
  currentEpisode: null,
  isLoading: false,
  playbackRate: 1.0,
  volume: 1.0,
  error: null,
  player: null,
  isBuffering: false,
  playerStatus: null,
};

// Reducer function
function audioReducer(state: AudioContextState, action: AudioAction): AudioContextState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_CURRENT_PODCAST':
      return { ...state, currentPodcast: action.payload };
    case 'SET_CURRENT_EPISODE':
      return { ...state, currentEpisode: action.payload };
    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload };
    case 'SET_PLAYER_STATUS':
      return { ...state, playerStatus: action.payload };
    case 'RESET_PLAYBACK':
      return {
        ...initialState,
        playbackRate: state.playbackRate,
        volume: state.volume,
      };
    default:
      return state;
  }
}

// Create context
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  CURRENT_POSITION: 'audio_current_position',
  CURRENT_PODCAST: 'audio_current_podcast',
  CURRENT_EPISODE: 'audio_current_episode',
  PLAYBACK_RATE: 'audio_playback_rate',
  VOLUME: 'audio_volume',
  QUIZ_PROGRESS: 'quiz_progress',
};

// Audio provider component
interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const isSeekingRef = useRef(false);
  const playerRef = useRef<AudioPlayer | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Update player status from expo-audio player
  const updatePlayerStatus = () => {
    if (!playerRef.current) return;
    
    const player = playerRef.current;
    const currentTime = (player.currentTime || 0) * 1000; // Convert to milliseconds
    const duration = (player.duration || 0) * 1000; // Convert to milliseconds
    
    if (!isSeekingRef.current) {
      dispatch({ type: 'SET_CURRENT_TIME', payload: currentTime });
    }
    
    dispatch({ type: 'SET_DURATION', payload: duration });
    dispatch({ type: 'SET_PLAYING', payload: player.playing || false });
    dispatch({ type: 'SET_PLAYBACK_RATE', payload: player.playbackRate || 1.0 });
  };

  // Start progress tracking
  const startProgressTracking = () => {
    // Clear existing interval if any
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Only start if player exists
    if (!playerRef.current) return;
    
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.playing) {
        updatePlayerStatus();
        saveCurrentState();
      }
    }, 1000); // Update every second
  };

  // Stop progress tracking
  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Initialize audio settings
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Load saved settings
        const savedRate = await AsyncStorage.getItem(STORAGE_KEYS.PLAYBACK_RATE);
        const savedVolume = await AsyncStorage.getItem(STORAGE_KEYS.VOLUME);

        if (savedRate) {
          dispatch({ type: 'SET_PLAYBACK_RATE', payload: parseFloat(savedRate) });
        }
        if (savedVolume) {
          dispatch({ type: 'SET_VOLUME', payload: parseFloat(savedVolume) });
        }

        // Restore previous session if available
        await restorePreviousSession();
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize audio system' });
      }
    };

    initializeAudio();

    return () => {
      // Cleanup on unmount
      stopProgressTracking();
      if (playerRef.current) {
        try {
          playerRef.current.remove();
        } catch (error) {
          console.error('Error removing player:', error);
        }
      }
    };
  }, []);

  // Restore previous session
  const restorePreviousSession = async () => {
    try {
      const savedPodcast = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PODCAST);
      const savedEpisode = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_EPISODE);
      
      if (savedPodcast) {
        const podcast = JSON.parse(savedPodcast);
        dispatch({ type: 'SET_CURRENT_PODCAST', payload: podcast });
        
        if (savedEpisode) {
          const episode = JSON.parse(savedEpisode);
          dispatch({ type: 'SET_CURRENT_EPISODE', payload: episode });
        }
      }
    } catch (error) {
      console.error('Failed to restore previous session:', error);
    }
  };

  // Save current state to storage
  const saveCurrentState = async () => {
    try {
      if (state.currentPodcast) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PODCAST, JSON.stringify(state.currentPodcast));
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_POSITION, state.currentTime.toString());
      }
      if (state.currentEpisode) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_EPISODE, JSON.stringify(state.currentEpisode));
      }
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYBACK_RATE, state.playbackRate?.toString() || '1.0');
      await AsyncStorage.setItem(STORAGE_KEYS.VOLUME, state.volume?.toString() || '1.0');
    } catch (error) {
      console.error('Failed to save current state:', error);
    }
  };


  // Play podcast function
  const playPodcast = async (podcast: Podcast, episode?: Episode) => {
    try {
      console.log('Starting playPodcast for:', podcast.title, 'audioUrl type:', typeof (episode?.audioUrl || podcast.audioUrl));
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Stop current player if playing
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
        dispatch({ type: 'SET_PLAYER', payload: null });
      }

      // Create new audio player using createAudioPlayer
      const audioUrl = episode?.audioUrl || podcast.audioUrl;
      console.log('Creating audio player with audioUrl:', audioUrl);
      
      // createAudioPlayer accepts string | number | AudioSource directly
      // No need to wrap in an object - expo-audio handles this internally
      const player = createAudioPlayer(audioUrl);
      console.log('Audio player created successfully:', player.id);
      
      playerRef.current = player;
      dispatch({ type: 'SET_PLAYER', payload: player });
      dispatch({ type: 'SET_CURRENT_PODCAST', payload: podcast });
      dispatch({ type: 'SET_CURRENT_EPISODE', payload: episode || null });

      // Set initial playback rate
      player.setPlaybackRate(state.playbackRate || 1.0);

      // Try to restore previous position if same content
      const savedPosition = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_POSITION);
      if (savedPosition && parseInt(savedPosition) > 0) {
        const positionInSeconds = parseInt(savedPosition) / 1000;
        await player.seekTo(positionInSeconds);
      }

      // Initialize quiz as always available (no unlock logic)
      await initializeQuizAvailability(podcast.id);
      
      // Start playing
      console.log('Calling player.play()');
      player.play();
      console.log('Player.play() called successfully');
      
      // Start progress tracking
      startProgressTracking();
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Failed to play podcast:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load audio. Please try again.' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Pause podcast function
  const pausePodcast = async () => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
        dispatch({ type: 'SET_PLAYING', payload: false });
        stopProgressTracking();
        await saveCurrentState();
      }
    } catch (error) {
      console.error('Failed to pause podcast:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to pause audio' });
    }
  };

  // Resume podcast function
  const resumePodcast = async () => {
    try {
      if (playerRef.current) {
        playerRef.current.play();
        dispatch({ type: 'SET_PLAYING', payload: true });
        startProgressTracking();
      } else if (state.currentPodcast) {
        // Player doesn't exist, recreate it with the saved podcast
        console.log('Player not found, recreating with saved podcast:', state.currentPodcast.title);
        await playPodcast(state.currentPodcast, state.currentEpisode || undefined);
      } else {
        console.warn('No player and no current podcast to resume');
        dispatch({ type: 'SET_ERROR', payload: 'No audio to resume' });
      }
    } catch (error) {
      console.error('Failed to resume podcast:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to resume audio' });
    }
  };

  // Seek to position function
  const seekTo = async (positionMillis: number) => {
    try {
      if (playerRef.current && positionMillis >= 0) {
        isSeekingRef.current = true;
        const positionInSeconds = positionMillis / 1000;
        await playerRef.current.seekTo(positionInSeconds);
        
        // Update state immediately for responsive UI
        dispatch({ type: 'SET_CURRENT_TIME', payload: positionMillis });
        
        // Reset seeking flag after a brief delay to allow status updates
        setTimeout(() => {
          isSeekingRef.current = false;
        }, 100);
        
        await saveCurrentState();
      }
    } catch (error) {
      console.error('Failed to seek:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to seek to position' });
      isSeekingRef.current = false;
    }
  };

  // Set playback rate function
  const setPlaybackRate = async (rate: number) => {
    try {
      if (playerRef.current) {
        playerRef.current.setPlaybackRate(rate);
      }
      dispatch({ type: 'SET_PLAYBACK_RATE', payload: rate });
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYBACK_RATE, rate.toString());
    } catch (error) {
      console.error('Failed to set playback rate:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to change playback speed' });
    }
  };

  // Set volume function (system volume control)
  const setVolume = async (volume: number) => {
    try {
      // Volume control in expo-audio is handled at system level
      // The player's volume property is read-only
      dispatch({ type: 'SET_VOLUME', payload: volume });
      await AsyncStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
    } catch (error) {
      console.error('Failed to set volume:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to adjust volume' });
    }
  };

  // Skip forward function
  const skipForward = async (seconds: number = 15) => {
    const newPosition = Math.min(state.currentTime + (seconds * 1000), state.duration);
    await seekTo(newPosition);
  };

  // Skip backward function
  const skipBackward = async (seconds: number = 15) => {
    const newPosition = Math.max(state.currentTime - (seconds * 1000), 0);
    await seekTo(newPosition);
  };

  // Stop podcast function
  const stopPodcast = async () => {
    try {
      stopProgressTracking();
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
        dispatch({ type: 'SET_PLAYER', payload: null });
      }
      dispatch({ type: 'RESET_PLAYBACK' });
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_POSITION);
    } catch (error) {
      console.error('Failed to stop podcast:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to stop audio' });
    }
  };

  // Get quiz progress for a podcast
  const getQuizProgress = async (podcastId: string): Promise<QuizProgress | null> => {
    try {
      const progressData = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
      if (!progressData) return null;
      
      const progress: Record<string, QuizProgress> = JSON.parse(progressData);
      return progress[podcastId] || null;
    } catch (error) {
      console.error('Error getting quiz progress:', error);
      return null;
    }
  };

  // Initialize quiz availability (quizzes are always available)
  const initializeQuizAvailability = async (podcastId: string) => {
    try {
      // Find quiz for this podcast
      const quiz = mockQuizzes.find(q => q.podcastId === podcastId);
      if (!quiz) return;

      const progressData = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
      const progress: Record<string, QuizProgress> = progressData ? JSON.parse(progressData) : {};
      
      const existingProgress = progress[quiz.id];
      
      // Always ensure quiz is available (no unlock requirements)
      if (!existingProgress) {
        const newProgress: QuizProgress = {
          quizId: quiz.id,
          podcastId: podcastId,
          isUnlocked: true, // Always available
          isCompleted: false,
          bestScore: 0,
          attempts: 0,
          lastAttemptDate: undefined,
          unlockedAt: new Date()
        };
        
        progress[quiz.id] = newProgress;
        await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(progress));
        
        console.log(`Quiz initialized as available for podcast: ${podcastId}`);
      }
    } catch (error) {
      console.error('Error initializing quiz availability:', error);
    }
  };

  // Context value
  const contextValue: AudioContextType = {
    ...state,
    playPodcast,
    pausePodcast,
    resumePodcast,
    seekTo,
    setPlaybackRate,
    setVolume,
    skipForward,
    skipBackward,
    stopPodcast,
    getQuizProgress,
    initializeQuizAvailability,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

// Custom hook to use audio context
export function useAudioContext(): AudioContextType {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}