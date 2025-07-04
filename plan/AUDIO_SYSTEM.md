# Audio Context and Playback Management System

This document describes the comprehensive audio system implemented for the podcast app, including usage examples and API documentation.

## Overview

The audio system provides a complete solution for podcast playback with the following features:

- **Background Audio Support**: Audio continues playing when the app is backgrounded
- **Progress Tracking**: Automatic saving and restoration of playback position
- **Speed Control**: Support for multiple playback speeds (0.5x to 2x)
- **Seek Functionality**: Navigate to any position in the audio
- **Volume Control**: Full volume management with mute functionality
- **Error Handling**: Graceful error handling and recovery
- **Loading States**: Visual feedback during audio operations

## Architecture

The system consists of three main components:

1. **AudioContext** (`contexts/AudioContext.tsx`): Core state management using expo-av
2. **useAudio Hook** (`hooks/useAudio.ts`): Convenient hook for audio operations
3. **UI Components**: PodcastCard and AudioPlayer components

## Setup

The app is already configured with the AudioProvider wrapping the entire application in `app/_layout.tsx`:

```tsx
<AudioProvider>
  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    {/* Your app content */}
  </ThemeProvider>
</AudioProvider>
```

## Usage

### Basic Audio Operations

```tsx
import { useAudio } from '@/hooks/useAudio';

function MyComponent() {
  const { 
    playContent, 
    togglePlayPause, 
    isPlaying, 
    currentPodcast 
  } = useAudio();

  const handlePlay = async () => {
    await playContent(podcast); // Start playing a podcast
  };

  const handleToggle = async () => {
    await togglePlayPause(); // Toggle play/pause
  };

  return (
    <View>
      <Text>{isPlaying ? 'Playing' : 'Paused'}</Text>
      <Text>{currentPodcast?.title}</Text>
    </View>
  );
}
```

### Advanced Controls

```tsx
function AdvancedControls() {
  const {
    seekTo,
    skipForward,
    skipBackward,
    setPlaybackRate,
    setVolume,
    getProgress,
    getFormattedCurrentTime,
    playbackRates,
    cyclePlaybackRate
  } = useAudio();

  return (
    <View>
      {/* Seek to 50% of the audio */}
      <Button onPress={() => seekTo(50)} title="Seek to 50%" />
      
      {/* Skip forward 30 seconds */}
      <Button onPress={() => skipForward(30)} title="Skip +30s" />
      
      {/* Change playback speed */}
      <Button onPress={() => setPlaybackRate(1.5)} title="1.5x Speed" />
      
      {/* Cycle through speeds */}
      <Button onPress={cyclePlaybackRate} title="Change Speed" />
      
      {/* Volume control */}
      <Slider
        value={volume}
        onSlidingComplete={setVolume}
        minimumValue={0}
        maximumValue={1}
      />
    </View>
  );
}
```

### State Monitoring

```tsx
function AudioState() {
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    error,
    isLoading,
    isBuffering,
    getProgress,
    getFormattedCurrentTime,
    getFormattedDuration
  } = useAudio();

  return (
    <View>
      <Text>Status: {isPlaying ? 'Playing' : 'Paused'}</Text>
      <Text>Progress: {getProgress().toFixed(1)}%</Text>
      <Text>Time: {getFormattedCurrentTime()} / {getFormattedDuration()}</Text>
      <Text>Speed: {playbackRate}x</Text>
      <Text>Volume: {Math.round(volume * 100)}%</Text>
      {error && <Text style={{color: 'red'}}>Error: {error}</Text>}
      {isLoading && <Text>Loading...</Text>}
      {isBuffering && <Text>Buffering...</Text>}
    </View>
  );
}
```

## Components

### PodcastCard

The `PodcastCard` component now includes built-in audio controls:

```tsx
<PodcastCard 
  podcast={podcast}
  showPlayButton={true} // Default is true
  onPress={() => {
    // Custom action when card is tapped
    // If not provided, it will handle audio playback
  }}
/>
```

Features:
- Play/pause button overlay on podcast image
- Visual indicators for currently playing podcast
- Loading states during audio operations
- Status indicators (playing, paused, loading)

### AudioPlayer

A comprehensive audio player component with two modes:

```tsx
{/* Compact mode - suitable for fixed bottom bar */}
<AudioPlayer compact={true} />

{/* Full mode - suitable for dedicated player screen */}
<AudioPlayer compact={false} />
```

Features:
- Play/pause controls
- Progress slider with seek functionality
- Skip forward/backward buttons
- Playback speed control
- Volume control with mute
- Time display
- Error handling

## API Reference

### Core Functions

- `playContent(podcast, episode?)`: Start playing audio
- `togglePlayPause()`: Toggle between play and pause
- `pausePodcast()`: Pause audio
- `resumePodcast()`: Resume audio
- `stopPodcast()`: Stop and reset audio
- `seekTo(positionMillis)`: Seek to specific position
- `seekToPercentage(percentage)`: Seek to percentage of duration
- `skipForward(seconds)`: Skip forward by seconds (default: 30)
- `skipBackward(seconds)`: Skip backward by seconds (default: 15)

### Settings Functions

- `setPlaybackRate(rate)`: Set playback speed (0.5 - 2.0)
- `cyclePlaybackRate()`: Cycle through available speeds
- `setVolume(volume)`: Set volume (0.0 - 1.0)
- `adjustVolume(delta)`: Adjust volume by delta
- `toggleMute()`: Toggle mute on/off

### Utility Functions

- `isCurrentPodcast(podcastId, episodeId?)`: Check if specific content is current
- `isContentPlaying(podcastId, episodeId?)`: Check if specific content is playing
- `getProgress()`: Get current progress percentage
- `getFormattedCurrentTime()`: Get formatted current time string
- `getFormattedDuration()`: Get formatted duration string
- `getRemainingTime()`: Get remaining time in milliseconds
- `getCurrentContentInfo()`: Get info about currently playing content
- `canControl()`: Check if audio controls are available

### State Properties

- `isPlaying`: Boolean indicating if audio is playing
- `currentTime`: Current playback position in milliseconds
- `duration`: Total audio duration in milliseconds
- `currentPodcast`: Currently loaded podcast object
- `currentEpisode`: Currently loaded episode object (if any)
- `isLoading`: Boolean indicating loading state
- `playbackRate`: Current playback speed
- `volume`: Current volume level (0.0 - 1.0)
- `error`: Current error message (if any)
- `isBuffering`: Boolean indicating buffering state

## Data Persistence

The audio system automatically saves and restores:

- Current playback position
- Currently playing podcast/episode
- Playback speed preference
- Volume setting

Data is persisted using AsyncStorage and restored when the app starts.

## Error Handling

The system includes comprehensive error handling for:

- Network connectivity issues
- Audio file loading problems
- Codec/format compatibility
- Permission errors

Errors are exposed through the `error` property and can be displayed to users.

## Background Audio

The system is configured for background audio playback:

```tsx
// Audio session configuration (already set up)
await Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

- `AudioContextType`: Complete context interface
- `PlaybackState`: Playback state structure
- `AudioError`: Error handling types
- `PlaybackSpeed`: Available speed options
- Custom hook return types for better IDE support

## Performance Considerations

- Progress is saved every 5 seconds during playback
- Audio objects are properly cleaned up on component unmount
- Minimal re-renders through optimized state management
- Efficient slider interactions with throttled updates

## Testing

The system uses mock audio URLs for development. Replace with actual podcast URLs in production:

```tsx
// In data/podcasts.ts - replace with real audio URLs
audioUrl: 'https://your-real-podcast-url.mp3'
```

## Customization

The system is highly customizable:

- Modify skip intervals in the audio context
- Customize playback speeds array
- Add additional audio formats
- Extend error handling
- Add custom audio effects or processing

## Integration Examples

See the implemented examples in:
- `app/(tabs)/index.tsx`: Home screen with compact player
- `app/(tabs)/library.tsx`: Library screen with compact player
- `components/PodcastCard.tsx`: Card with integrated audio controls
- `components/AudioPlayer.tsx`: Full-featured audio player component