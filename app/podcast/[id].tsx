import { BottomSheet } from '@/components/BottomSheet';
import { Confetti } from '@/components/Confetti';
import { NavigationBar } from '@/components/NavigationBar';
import { NoteEditor } from '@/components/NoteEditor';
import { SimpleMarkdown } from '@/components/SimpleMarkdown';
import { SourceSheet } from '@/components/SourceSheet';
import { WebScrollView } from '@/components/WebScrollView';
import { useAudioContext } from '@/contexts/AudioContext';
import { useNotes } from '@/contexts/NotesContext';
import { educationalContent, EducationalContent } from '@/data/educational-content';
import { mockQuizzes } from '@/data/quizzes';
import { getScriptByPodcastId } from '@/data/scripts';
import { useAudio } from '@/hooks/useAudio';
import { Note } from '@/types/notes';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { FileText, Lightbulb, Pause, Play, Plus, ScrollText, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Helper function to get topic colors based on category
const getTopicColors = (category: string) => {
  switch (category) {
    case 'Special Educational Needs':
      return {
        background: 'bg-purple-100',
        badge: 'bg-purple-200',
        text: 'text-purple-900',
        hex: '#7C3AED', // purple-700
        lightHex: '#E9D5FF' // purple-200
      };
    case 'Artificial Intelligence':
      return {
        background: 'bg-amber-100',
        badge: 'bg-amber-200',
        text: 'text-amber-900',
        hex: '#B45309', // amber-700
        lightHex: '#FEF3C7' // amber-100
      };
    case 'Teacher mental health literacy':
      return {
        background: 'bg-teal-100',
        badge: 'bg-teal-200',
        text: 'text-teal-900',
        hex: '#0F766E', // teal-700
        lightHex: '#CCFBF1' // teal-100
      };
    default:
      return {
        background: 'bg-purple-100',
        badge: 'bg-purple-200',
        text: 'text-purple-900',
        hex: '#7C3AED',
        lightHex: '#E9D5FF'
      };
  }
};

export default function PodcastDetailsScreen() {
  const router = useRouter();
  const { id, from, topicId } = useLocalSearchParams<{ id: string; from?: string; topicId?: string }>();
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [notesInView, setNotesInView] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNewNote, setIsNewNote] = useState(false);
  const [showSourceSheet, setShowSourceSheet] = useState(false);
  const [showScriptSheet, setShowScriptSheet] = useState(false);
  const [likeStatus, setLikeStatus] = useState<'liked' | 'disliked' | null>(null);
  const [showLikeConfetti, setShowLikeConfetti] = useState(false);
  
  // Animation values for each note card - start at 0 degrees
  const note1Rotation = useSharedValue(0);
  const note2Rotation = useSharedValue(0);
  const note3Rotation = useSharedValue(0);
  const note4Rotation = useSharedValue(0);
  
  // Animation values for like button
  const likeButtonScale = useSharedValue(1);
  const likeButtonRotation = useSharedValue(0);
  
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
  const { width: screenWidth } = useWindowDimensions();
  const notesContainerPadding = 48; // 24px padding on each side (px-6)
  const noteGap = 16;
  
  // Max content width from WebScrollView (max-w-3xl = 768px)
  const maxContentWidth = 768;
  const contentWidth = Math.min(screenWidth, maxContentWidth);
  
  // Responsive breakpoints
  const isTablet = screenWidth >= 768;
  const notesPerRow = 2; // Always 2 columns for consistency
  
  // Calculate note card width considering the gaps between cards and max width constraint
  const totalGaps = (notesPerRow - 1) * noteGap;
  const availableWidth = contentWidth - notesContainerPadding - totalGaps;
  const noteCardWidth = Math.floor(availableWidth / notesPerRow);
  const noteCardHeight = isTablet ? 140 : 120; // Slightly taller on tablet

  const {
    isContentPlaying,
    isCurrentPodcast,
    playContent,
    isLoading,
    isContentBuffering,
  } = useAudio();

  const { currentPodcast: currentlyPlayingPodcast } = useAudioContext();
  const { getNotesForPodcast, createNote, updateNote, deleteNote } = useNotes();

  // Get topic colors based on content category
  const topicColors = content ? getTopicColors(content.category) : getTopicColors('');

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
      author: content.author,
      sources: content.sources,
      category: content.category
    };
    await playContent(podcastFormat);
  };

  const handleQuizPress = () => {
    if (!content) return;
    const quiz = mockQuizzes.find(q => q.podcastId === content.id);
    if (quiz) {
      router.push({
        pathname: `/quiz/${quiz.id}` as any,
        params: { podcastId: content.id }
      });
    }
  };

  const handleShare = async () => {
    if (!content) return;
    
    try {
      if (Platform.OS === 'web') {
        // Web platform handling
        const shareData = {
          title: content.title,
          text: `Check out this podcast: ${content.title} by ${content.author}`,
          url: window.location.href
        };

        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          throw new Error('Web Share API not supported');
        }
      } else {
        // Use React Native Share for mobile platforms
        const shareOptions = {
          message: `Check out this podcast: ${content.title} by ${content.author}`,
          title: content.title,
        };
        await Share.share(shareOptions);
      }
    } catch (error) {
      console.error('Sharing not supported on this platform:', error);
      // Catch-all fallback - show a simple message
      alert('Sharing is not available on this platform.');
    }
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
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(note);
      setIsNewNote(false);
      setShowNoteEditor(true);
    }
  };

  const handleNewNotePress = () => {
    setEditingNote(null);
    setIsNewNote(true);
    setShowNoteEditor(true);
  };

  const handleSaveNote = async (title: string, content: string) => {
    if (!id) return;
    
    try {
      if (isNewNote) {
        await createNote(id, { title, content });
      } else if (editingNote) {
        await updateNote(editingNote.id, { title, content });
      }
      // Reload notes after saving
      await loadNotes(id);
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  };

  const handleDeleteNote = async () => {
    if (!editingNote) return;
    
    try {
      await deleteNote(editingNote.id);
      setShowNoteEditor(false);
      // Reload notes after deletion
      if (id) await loadNotes(id);
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  const handleCloseNoteEditor = () => {
    setShowNoteEditor(false);
    setEditingNote(null);
    setIsNewNote(false);
  };

  const handleLike = () => {
    const wasLiked = likeStatus === 'liked';
    setLikeStatus(wasLiked ? null : 'liked');
    
    if (!wasLiked) {
      // Trigger bouncy animation
      likeButtonScale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 200 }),
        withSpring(1, { damping: 3, stiffness: 300 })
      );
      
      likeButtonRotation.value = withSequence(
        withSpring(-10, { damping: 2, stiffness: 200 }),
        withSpring(10, { damping: 2, stiffness: 200 }),
        withSpring(0, { damping: 3, stiffness: 300 })
      );
      
      // Show confetti
      setShowLikeConfetti(true);
      setTimeout(() => setShowLikeConfetti(false), 1200);
    }
  };

  const handleDislike = () => {
    setLikeStatus(likeStatus === 'disliked' ? null : 'disliked');
  };
  
  const likeButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: likeButtonScale.value },
        { rotate: `${likeButtonRotation.value}deg` },
      ],
    };
  });

  if (!content) {
    return (
      <View className="flex-1 justify-center items-center">
        <StatusBar barStyle="dark-content" />
        <Text className="text-lg text-slate-600">
          Content not found
        </Text>
      </View>
    );
  }

  const isThisPodcastCurrent = isCurrentPodcast(content.id);
  const isThisPodcastPlaying = isContentPlaying(content.id);
  const isThisPodcastLoading = isThisPodcastCurrent && (isLoading || isContentBuffering);
  const hasQuiz = mockQuizzes.some(q => q.podcastId === content.id);
  
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
      <View className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Navigation Bar */}
        <NavigationBar 
          onBackPress={() => {
            if (from === 'topic' && topicId) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
          showUploadButton={true}
          onUploadPress={handleShare}
        />

        <WebScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 76, paddingBottom: scrollPaddingBottom }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Main Content Card */}
          <View className="mx-6 relative">
            {/* Main Card */}
            <View 
              className="bg-white rounded-3xl border border-slate-100 drop-shadow-sm"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              {/* Card Content */}
              <View className="p-6">
                {/* Podcast Image */}
                <View className="w-24 h-24 rounded-full overflow-hidden mb-4" style={{ backgroundColor: topicColors.hex }}>
                  <Image
                    source={require('@/assets/images/cover-album.png')}
                    style={{ width: 96, height: 96 }}
                    resizeMode="cover"
                  />
                </View>
                {/* Category Tag */}
                <View className="self-start mb-2">
                  <View className={`${topicColors.badge} rounded-full px-2 py-1`}>
                    <Text className={`${topicColors.text} text-xs font-semibold`}>
                      {content.category}
                    </Text>
                  </View>
                </View>

                {/* Title and Meta */}
                <Text className="text-slate-900 text-lg font-semibold mb-2 leading-7">
                  {content.title}
                </Text>
                <Text className="text-slate-600 text-sm mb-6">
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
                        {isThisPodcastPlaying ? (
                          <Pause size={16} color="white" strokeWidth={2} style={{ marginRight: 4 }} />
                        ) : (
                          <Play size={16} color="white" strokeWidth={2} style={{ marginRight: 4 }} />
                        )}
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
                      className="w-full bg-white rounded-full py-3 flex-row items-center justify-center border border-slate-200"
                      activeOpacity={0.8}
                    >
                      <Lightbulb
                        size={16}
                        color="#000"
                        strokeWidth={2}
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
          <View className="px-6 mt-6">
            <SimpleMarkdown className="px-1">
              {content.description}
            </SimpleMarkdown>
            
            {/* Action Buttons */}
            <View className="flex-row items-center justify-between mt-4">
              {/* Like/Dislike Buttons */}
              <View className="flex-row gap-3">
                {/* Like Button */}
                <View style={{ position: 'relative' }}>
                  <AnimatedTouchableOpacity 
                    onPress={handleLike}
                    className="p-3 rounded-full items-center justify-center"
                    style={[
                      {
                        backgroundColor: likeStatus === 'liked' ? topicColors.hex : topicColors.lightHex,
                      },
                      likeButtonAnimatedStyle
                    ]}
                  >
                    <ThumbsUp 
                      size={16} 
                      color={likeStatus === 'liked' ? '#FFFFFF' : topicColors.hex} 
                      strokeWidth={2} 
                    />
                  </AnimatedTouchableOpacity>
                  <Confetti isVisible={showLikeConfetti} />
                </View>
                
                {/* Dislike Button */}
                <TouchableOpacity 
                  onPress={handleDislike}
                  className="p-3 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: likeStatus === 'disliked' ? topicColors.hex : topicColors.lightHex,
                  }}
                >
                  <ThumbsDown 
                    size={16} 
                    color={likeStatus === 'disliked' ? '#FFFFFF' : topicColors.hex} 
                    strokeWidth={2} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Script/Source Buttons */}
              <View className="flex-row gap-3">
                {/* Script Button */}
                <TouchableOpacity 
                  onPress={() => setShowScriptSheet(true)}
                  className="px-4 py-3 rounded-full flex-row items-center gap-2"
                  style={{
                    backgroundColor: topicColors.lightHex,
                  }}
                >
                  <ScrollText size={16} color={topicColors.hex} strokeWidth={2} />
                  <Text className={`text-sm font-semibold ${topicColors.text}`}>Script</Text>
                </TouchableOpacity>
                
                {/* Source Button */}
                <TouchableOpacity 
                  onPress={() => setShowSourceSheet(true)}
                  className="px-4 py-3 rounded-full flex-row items-center gap-2"
                  style={{
                    backgroundColor: topicColors.lightHex,
                  }}
                >
                  <FileText size={16} color={topicColors.hex} strokeWidth={2} />
                  <Text className={`text-sm font-semibold ${topicColors.text}`}>Sources</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Your Notes Section */}
          <View className="px-6 mt-8 mb-8">
            <Text className="text-black text-base font-medium mb-4 px-1">
              Your notes
            </Text>
            
            {/* Responsive Grid Container */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -noteGap/2 }}>
              {/* Existing Notes */}
              {notes.slice(0, 3).map((note, index) => {
                const animatedStyle = index === 0 ? note1AnimatedStyle :
                                    index === 1 ? note2AnimatedStyle :
                                    note3AnimatedStyle;
                
                return (
                  <View key={note.id} style={{ paddingHorizontal: noteGap/2, marginBottom: noteGap }}>
                    <TouchableOpacity 
                      className="relative" 
                      style={{ width: noteCardWidth, height: noteCardHeight }}
                      activeOpacity={0.8}
                      onPress={() => handleNotePress(note.id)}
                    >
                      <Animated.View 
                        className={`${topicColors.badge} rounded-3xl p-4 w-full h-full justify-between`}
                        style={[animatedStyle]}
                      >
                        <Text className="text-slate-600 text-xs">{formatNoteDate(note.createdAt)}</Text>
                        <Text className="text-slate-900 text-base font-medium leading-6" numberOfLines={2}>
                          {note.title}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Placeholder cards if less than max notes */}
              {(() => {
                const displayedNotesCount = Math.min(notes.length, 3);
                const maxNotesInRow = 4; // 3 notes + 1 "New note" card in 2x2 grid
                const placeholderCount = Math.max(0, maxNotesInRow - displayedNotesCount - 1); // -1 for new note card
                return Array.from({ length: placeholderCount }).map((_, index) => {
                  const actualIndex = notes.length + index;
                  const animatedStyle = actualIndex === 0 ? note1AnimatedStyle :
                                      actualIndex === 1 ? note2AnimatedStyle :
                                      note3AnimatedStyle;
                  
                  return (
                    <View key={`placeholder-${index}`} style={{ paddingHorizontal: noteGap/2, marginBottom: noteGap }}>
                      <TouchableOpacity 
                        className="relative" 
                        style={{ width: noteCardWidth, height: noteCardHeight }}
                        activeOpacity={0.7}
                        onPress={handleNewNotePress}
                      >
                        <Animated.View 
                          className="bg-slate-50 rounded-3xl p-4 w-full h-full justify-center items-center"
                          style={[animatedStyle]}
                        >
                          <Text className="text-slate-400 text-sm">No note yet</Text>
                        </Animated.View>
                      </TouchableOpacity>
                    </View>
                  );
                });
              })()}

              {/* New Note Card */}
              <View style={{ paddingHorizontal: noteGap/2, marginBottom: noteGap }}>
                <TouchableOpacity 
                  className="relative" 
                  style={{ width: noteCardWidth, height: noteCardHeight }}
                  activeOpacity={0.7}
                  onPress={handleNewNotePress}
                >
                  <Animated.View 
                    className="bg-white rounded-3xl p-4 w-full h-full justify-between"
                    style={[note4AnimatedStyle]}
                  >
                    <View className="bg-slate-200 rounded-full p-2 self-start">
                      <Plus size={16} color="#000" strokeWidth={2} />
                    </View>
                    <Text className="text-slate-600 text-base font-medium">
                      New note
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Next Steps Section */}
          <View className="px-6 mt-8 mb-8">
            <Text className="text-black text-xl font-medium mb-6 px-1">
              Next steps?
            </Text>
            
            {/* Course Card */}
            <View className="relative">
              {/* Course Image */}
              <View className="w-full h-50 rounded-3xl overflow-hidden mb-6">
                <Image
                  source={require('@/assets/images/next-step-cover-1.png')}
                  style={{ width: '100%', height: 200 }}
                  resizeMode="cover"
                />
              </View>
              
              {/* Course Content */}
              <View className="space-y-2">
                <Text className="text-slate-900 text-lg font-semibold leading-7">
                  Managing ADHD, Autism, Learning Disabilities, and Concussion in School
                </Text>
                <Text className="text-slate-600 text-sm leading-6">
                  Skills you'll gain: Autism Spectrum Disorders, Mental and Behaviour Health Specialities, School Psychology, Patient Evaluation, Disabilities...
                </Text>
                <Text className="text-slate-500 text-sm">
                  Guidance Branch (MOE) • 6 months ago
                </Text>
              </View>
            </View>
          </View>
        </WebScrollView>
        
        {/* Note Editor Bottom Sheet */}
        <BottomSheet
          visible={showNoteEditor}
          onClose={handleCloseNoteEditor}
          height={600}
        >
          <NoteEditor
            note={editingNote}
            isNewNote={isNewNote}
            onSave={handleSaveNote}
            onDelete={isNewNote ? undefined : handleDeleteNote}
            onClose={handleCloseNoteEditor}
          />
        </BottomSheet>
        
        {/* Source Bottom Sheet */}
        <BottomSheet
          visible={showSourceSheet}
          onClose={() => setShowSourceSheet(false)}
          height={490}
        >
          <SourceSheet 
            sources={content.sources || []} 
            onClose={() => setShowSourceSheet(false)}
          />
        </BottomSheet>
        
        {/* Script Bottom Sheet */}
        <BottomSheet
          visible={showScriptSheet}
          onClose={() => setShowScriptSheet(false)}
          height={600}
        >
          <View className="flex-1 p-4">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <Text className="text-black text-xl font-geist-medium">
                Script
              </Text>
              <TouchableOpacity
                onPress={() => setShowScriptSheet(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <Text className="text-base text-black">×</Text>
              </TouchableOpacity>
            </View>
            
            {/* Script Content */}
            {(() => {
              const script = getScriptByPodcastId(content.id);
              
              if (!script) {
                return (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-slate-500 text-center">
                      No script available for this podcast
                    </Text>
                  </View>
                );
              }
              
              return (
                <ScrollView 
                  className="flex-1"
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <Text className="text-slate-700 text-sm leading-6" selectable>
                    {script.content}
                  </Text>
                </ScrollView>
              );
            })()}
          </View>
        </BottomSheet>
      </View>
    </>
  );
}