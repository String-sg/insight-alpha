# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive podcast listening app built with React Native, Expo SDK 53, and NativeWind. The app features podcast discovery, audio playback with mini and fullscreen players, progress tracking, and an educational quiz system that unlocks after listening to 80% of a podcast.

## Technology Stack

- **Framework**: Expo SDK 53
- **Language**: TypeScript
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Navigation**: Expo Router with tabs + modal layouts
- **Audio**: Expo AV with background playback support
- **Storage**: AsyncStorage for progress and quiz data
- **Package Manager**: npm

## Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Linting
npm run lint

# Reset project to clean state
npm run reset-project

# Clear cache and restart (for CSS changes)
npm start -- --clear-cache
```

## App Architecture

### Core Features
1. **Podcast Discovery**: Browse available podcasts on homepage
2. **Audio Playback**: Background-enabled audio with progress tracking
3. **Mini Player**: Persistent bottom player with basic controls
4. **Fullscreen Player**: Complete audio controls and podcast details
5. **Quiz System**: Educational quizzes unlocked after 80% completion
6. **User Library**: Track played podcasts, favorites, and quiz progress

### Navigation Structure
```
app/
├── (tabs)/
│   ├── index.tsx          # Podcast discovery homepage
│   ├── library.tsx        # User library and quiz tracking
│   └── _layout.tsx        # Tab bar configuration
├── player.tsx             # Fullscreen audio player (modal)
├── quiz/
│   ├── [id].tsx          # Quiz taking screen
│   └── result.tsx        # Quiz results and analysis
└── _layout.tsx           # Root layout with AudioProvider
```

## Audio System

### AudioContext (`contexts/AudioContext.tsx`)
- Background audio playback with expo-av
- Progress tracking and persistence via AsyncStorage
- Playback speed control (0.5x - 2.0x)
- Volume control and seek functionality
- Quiz unlock progress tracking (80% threshold)

### Key Audio Functions
```tsx
const { 
  playPodcast,     // Start playing a podcast
  pausePodcast,    // Pause current playback  
  resumePodcast,   // Resume paused audio
  seekTo,          // Seek to specific time
  setPlaybackRate, // Change playback speed
  currentPodcast,  // Currently loaded podcast
  isPlaying,       // Playback state
  progress         // Current progress data
} = useAudio();
```

## Quiz System

### Quiz Logic
- Quizzes unlock automatically when user reaches 80% podcast completion
- 3-5 multiple choice questions per podcast with explanations
- 70% passing score required, users can retake for better scores
- Results stored in AsyncStorage with attempt tracking

### Quiz Components
- `QuizCard.tsx` - Quiz status display (locked/available/completed)
- `QuizQuestion.tsx` - Interactive question with animations
- Quiz screens with timer, progress tracking, and detailed results

## Data Management

### Local Storage (AsyncStorage)
```
audio_progress     # Podcast playback positions
quiz_progress      # Quiz unlock status (80% threshold)
quiz_attempts      # Quiz scores and completion data
audio_settings     # Volume, playback rate preferences
```

### Mock Data
- `data/podcasts.ts` - 8 diverse podcast episodes with metadata
- `data/quizzes.ts` - Corresponding quizzes for each podcast
- All data includes realistic content for demonstration

## Component Architecture

### Key Components
- `PodcastCard.tsx` - Podcast list item with play/pause
- `MiniPlayer.tsx` - Bottom-screen persistent player
- `AudioPlayer.tsx` - Full-featured player component (unused, replaced by modal)
- `QuizCard.tsx` - Quiz status and navigation
- `QuizQuestion.tsx` - Interactive quiz question

### Styling with NativeWind

Configuration files:
- `tailwind.config.js` - NativeWind preset + content paths
- `global.css` - Tailwind directives import
- `babel.config.js` - NativeWind babel preset
- `metro.config.js` - CSS processing configuration
- `nativewind-env.d.ts` - TypeScript support

Usage example:
```tsx
<View className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
  <Text className="text-lg font-bold text-gray-900 dark:text-white">
    NativeWind supports dark mode automatically
  </Text>
</View>
```

## TypeScript Types

Located in `types/` directory:
- `podcast.ts` - Podcast, Episode, PlaybackState interfaces
- `audio.ts` - Audio controls, settings, and metadata types  
- `quiz.ts` - Quiz, Question, QuizResult, and progress types
- `index.ts` - Barrel exports for easy importing

## Key Dependencies

### Core Framework
- `expo` (~53.0.12) - React Native framework
- `expo-router` (~5.1.0) - File-based navigation
- `expo-av` (~15.1.6) - Audio/video playback

### Audio & Storage
- `react-native-reanimated` (~3.17.4) - Animations
- `@react-native-async-storage/async-storage` (~2.2.0) - Local storage
- `react-native-slider` (~0.11.0) - Audio seek controls

### Styling & UI
- `nativewind` (^4.1.23) - Tailwind CSS for React Native
- `tailwindcss` (^3.4.17) - CSS framework
- `react-native-safe-area-context` (^5.4.0) - Safe area handling

## Development Notes

### Important Behaviors
- **Audio continues in background** when app is minimized
- **Progress is saved automatically** and restored on app launch
- **Quiz unlocks happen in real-time** as users reach 80% completion
- **Mini player appears/disappears** based on audio state
- **All data persists** between app sessions via AsyncStorage

### Platform Support
- **iOS**: Full native audio controls, background playback
- **Android**: Background audio with notification controls
- **Web**: Browser-based audio (no background support)

### Development Tips
- Use `npm start -- --clear-cache` when NativeWind styles don't update
- Audio requires device/simulator testing (limited web support)
- AsyncStorage data persists between development sessions
- Check iOS simulator Control Center for background audio controls

### Common Patterns
```tsx
// Playing a podcast
const { playPodcast } = useAudio();
await playPodcast(podcastData);

// Checking quiz unlock status  
const { quizProgress } = useAudio();
const canTakeQuiz = quizProgress[podcastId] >= 0.8;

// Navigation to quiz
router.push(`/quiz/${podcast.id}`);
```

This is a production-ready podcast app with comprehensive audio management, educational features, and a polished user experience across all supported platforms.