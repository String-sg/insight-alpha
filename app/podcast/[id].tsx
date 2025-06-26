import { Icon } from '@/components/Icon';
import { useAudioContext } from '@/contexts/AudioContext';
import { useNotes } from '@/contexts/NotesContext';
import { educationalContent, EducationalContent } from '@/data/educational-content';
import { mockQuizzes } from '@/data/quizzes';
import { useAudio } from '@/hooks/useAudio';
import { Note } from '@/types/notes';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function PodcastDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState(0);
  const [notesInView, setNotesInView] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Animation values for each note card - start at 0 degrees
  const note1Rotation = useSharedValue(0);
  const note2Rotation = useSharedValue(0);
  const note3Rotation = useSharedValue(0);
  const note4Rotation = useSharedValue(0);
  
  const note1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${note1Rotation.value}deg` }],
    };
  });
  
  const note2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${note2Rotation.value}deg` }],
    };
  });
  
  const note3AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${note3Rotation.value}deg` }],
    };
  });
  
  const note4AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${note4Rotation.value}deg` }],
    };
  });
  
  // Animate notes when they come into view
  const animateNotesIntoView = () => {
    if (!notesInView) {
      setNotesInView(true);
      // Generate random rotations between -4 and 4 degrees
      const randomRotation = () => Math.random() * 8 - 4;
      
      // Stagger the animations with slight delays
      setTimeout(() => note1Rotation.value = withTiming(randomRotation(), { duration: 400 }), 0);
      setTimeout(() => note2Rotation.value = withTiming(randomRotation(), { duration: 400 }), 100);
      setTimeout(() => note3Rotation.value = withTiming(randomRotation(), { duration: 400 }), 200);
      setTimeout(() => note4Rotation.value = withTiming(randomRotation(), { duration: 400 }), 300);
    }
  };
  
  // Get screen dimensions for responsive layout
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const notesContainerPadding = 32; // 16px padding on each side
  const noteGap = 16;
  const notesPerRow = isTablet ? 4 : 2;
  const totalGaps = (notesPerRow - 1) * noteGap;
  const noteCardWidth = (screenWidth - notesContainerPadding - totalGaps) / notesPerRow;

  const {
    isContentPlaying,
    isCurrentPodcast,
    playContent,
    isLoading,
    isContentBuffering,
  } = useAudio();

  const { currentPodcast: currentlyPlayingPodcast } = useAudioContext();
  const { getNotesForPodcast } = useNotes();

  const loadNotes = useCallback(async (podcastId: string) => {
    const podcastNotes = await getNotesForPodcast(podcastId);
    setNotes(podcastNotes);
  }, [getNotesForPodcast]);

  useEffect(() => {
    if (id) {
      const foundContent = educationalContent.find(c => c.id === id);
      setContent(foundContent || null);
    }
  }, [id]);

  // Load notes when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadNotes(id);
      }
    }, [id, loadNotes])
  );

  const handlePlayPress = async () => {
    if (!content) return;

    // Convert EducationalContent to Podcast format for audio system
    const podcastFormat = {
      id: content.id,
      title: content.title,
      description: content.description,
      imageUrl: content.imageUrl,
      audioUrl: content.audioUrl,
      duration: content.duration,
      author: content.author
    };
    await playContent(podcastFormat);
  };

  const handleQuizPress = () => {
    if (!content) return;
    const quiz = mockQuizzes.find(q => q.podcastId === content.id);
    if (quiz) {
      router.push(`/quiz/${quiz.id}`);
    }
  };

  const handleDescriptionTextLayout = (event: any) => {
    setDescriptionLines(event.nativeEvent.lines.length);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const formatNoteDate = (timestamp: number) => {
    const now = new Date();
    const noteDate = new Date(timestamp);
    const diffDays = Math.floor((now.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    return noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotePress = (noteId: string) => {
    router.push(`/notes/${noteId}?podcastId=${id}`);
  };

  const handleNewNotePress = () => {
    router.push(`/notes/new?podcastId=${id}`);
  };

  if (!content) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#ffffff', backgroundImage: 'linear-gradient(to bottom, #f5f5f5 90%, #ddd0ff 100%)' }}>
        <StatusBar barStyle="dark-content" />
        <Text className="text-lg text-gray-600">
          Content not found
        </Text>
      </View>
    );
  }

  const isThisPodcastCurrent = isCurrentPodcast(content.id);
  const isThisPodcastPlaying = isContentPlaying(content.id);
  const isThisPodcastLoading = isThisPodcastCurrent && (isLoading || isContentBuffering);
  const hasQuiz = mockQuizzes.some(q => q.podcastId === content.id);
  const shouldShowSeeMore = descriptionLines > 3 && !isDescriptionExpanded;
  
  // Check if mini player is visible (any podcast is currently loaded)
  const isMiniPlayerVisible = currentlyPlayingPodcast !== null;
  
  // Calculate dynamic padding for scroll content - match other screens
  const scrollPaddingBottom = isMiniPlayerVisible ? 120 : 40;
  
  // Handle scroll events to detect when notes section is in view
  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const screenHeight = layoutMeasurement.height;
    
    // Approximate position where notes section starts (after content card and description)
    const notesOffsetPosition = 600; // Adjust based on your layout
    const notesVisibilityThreshold = notesOffsetPosition - (screenHeight * 0.7);
    
    if (scrollY >= notesVisibilityThreshold && !notesInView) {
      animateNotesIntoView();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1" style={{ backgroundColor: '#ffffff', backgroundImage: 'linear-gradient(to bottom, #f5f5f5 90%, #ddd0ff 100%)' }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Custom Header */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-12 pb-4 bg-transparent">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          >
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          >
            <Icon name="share-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 120, paddingBottom: scrollPaddingBottom }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Main Content Card */}
          <View className="mx-4 mt-8 relative">
            {/* Glassmorphism Card */}
            <View 
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-black/10 drop-shadow-sm"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              {/* Content Cover - Overlapping */}
              <View className="absolute -top-6 left-4 w-24 h-24 rounded-2xl overflow-hidden bg-purple-500 drop-shadow-md">
                <Image
                  source={require('@/assets/images/podcast-cover-1.png')}
                  style={{ width: 96, height: 96 }}
                  resizeMode="cover"
                />
              </View>

              {/* Card Content */}
              <View className="pt-20 pb-4 px-4">
                {/* Category Tag */}
                <View className="self-start mb-2">
                  <View className="bg-purple-200 rounded-full px-2 py-1">
                    <Text className="text-purple-800 text-xs font-semibold">
                      {content.category}
                    </Text>
                  </View>
                </View>

                {/* Title and Meta */}
                <Text className="text-gray-900 text-lg font-semibold mb-2 leading-7">
                  {content.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-6">
                  By {content.author} · 2 days ago
                </Text>

                {/* Action Buttons */}
                <View className="space-y-4">
                  {/* Play Button */}
                  <TouchableOpacity
                    onPress={handlePlayPress}
                    className="w-full bg-black rounded-full py-3 flex-row items-center justify-center"
                    activeOpacity={0.8}
                  >
                    {isThisPodcastLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Icon
                          name={isThisPodcastPlaying ? "pause" : "play"}
                          size={16}
                          color="white"
                          style={{ marginRight: 4 }}
                        />
                        <Text className="text-white text-sm font-medium">
                          {isThisPodcastCurrent
                            ? (isThisPodcastPlaying ? 'Pause' : 'Resume')
                            : 'Play'
                          }
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Take Quiz Button */}
                  {hasQuiz && (
                    <TouchableOpacity
                      onPress={handleQuizPress}
                      className="w-full bg-white/50 backdrop-blur-sm rounded-full py-3 flex-row items-center justify-center border border-black/10"
                      activeOpacity={0.8}
                    >
                      <Icon
                        name="bulb-outline"
                        size={16}
                        color="#000"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-black text-sm font-medium">
                        Take the quiz
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View className="px-4 mt-6">
            <Text
              className="text-gray-600 text-sm leading-6 px-1"
              numberOfLines={isDescriptionExpanded ? undefined : 3}
              onTextLayout={handleDescriptionTextLayout}
            >
              {content.description}
            </Text>

            {/* See More/Less Button */}
            {(shouldShowSeeMore || isDescriptionExpanded) && (
              <TouchableOpacity
                onPress={toggleDescription}
                className="mt-1 self-start px-1"
                activeOpacity={0.7}
              >
                <Text className="text-black text-sm font-medium">
                  {isDescriptionExpanded ? 'See less' : 'See more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Your Notes Section */}
          <View className="px-4 mt-8 mb-8">
            <Text className="text-black text-base font-medium mb-4 px-1">
              Your notes
            </Text>
            
            {/* Responsive Grid Container */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: noteGap }}>
              {/* Existing Notes */}
              {notes.slice(0, 3).map((note, index) => {
                const animatedStyle = index === 0 ? note1AnimatedStyle :
                                    index === 1 ? note2AnimatedStyle :
                                    note3AnimatedStyle;
                
                return (
                  <TouchableOpacity 
                    key={note.id}
                    className="relative" 
                    style={{ width: noteCardWidth, height: 120 }}
                    activeOpacity={0.8}
                    onPress={() => handleNotePress(note.id)}
                  >
                    <Animated.View 
                      className="bg-purple-100 rounded-3xl border border-black/10 p-4 w-full h-full justify-between"
                      style={[animatedStyle]}
                    >
                      <Text className="text-gray-600 text-xs">{formatNoteDate(note.createdAt)}</Text>
                      <Text className="text-gray-900 text-base font-medium leading-6" numberOfLines={2}>
                        {note.title}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}

              {/* Placeholder cards if less than 3 notes */}
              {notes.length < 3 && Array.from({ length: 3 - notes.length }).map((_, index) => {
                const actualIndex = notes.length + index;
                const animatedStyle = actualIndex === 0 ? note1AnimatedStyle :
                                    actualIndex === 1 ? note2AnimatedStyle :
                                    note3AnimatedStyle;
                
                return (
                  <TouchableOpacity 
                    key={`placeholder-${index}`}
                    className="relative" 
                    style={{ width: noteCardWidth, height: 120 }}
                    activeOpacity={0.7}
                    onPress={handleNewNotePress}
                  >
                    <Animated.View 
                      className="bg-white/30 backdrop-blur-sm rounded-3xl border border-dashed border-black/10 p-4 w-full h-full justify-center items-center"
                      style={[animatedStyle]}
                    >
                      <Text className="text-gray-400 text-sm">No note yet</Text>
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}

              {/* New Note Card */}
              <TouchableOpacity 
                className="relative" 
                style={{ width: noteCardWidth, height: 120 }}
                activeOpacity={0.7}
                onPress={handleNewNotePress}
              >
                <Animated.View 
                  className="bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-black/20 p-4 w-full h-full justify-between"
                  style={[note4AnimatedStyle]}
                >
                  <View className="bg-gray-200 rounded-full p-2 self-start">
                    <Icon name="add" size={16} color="#000" />
                  </View>
                  <Text className="text-gray-600 text-base font-medium">
                    New note
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}