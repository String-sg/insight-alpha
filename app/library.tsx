import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioContext } from '@/contexts/AudioContext';
import { QuizCard } from '@/components/QuizCard';
import { mockQuizzes } from '@/data/quizzes';
import { mockPodcasts } from '@/data/podcasts';
import { QuizProgress, QuizStatus } from '@/types/quiz';
import { SegmentedControl } from '@/components/SegmentedControl';

export default function LibraryScreen() {
  const [quizProgress, setQuizProgress] = useState<Record<string, QuizProgress>>({});
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites' | 'downloads' | 'quizzes'>('recent');
  const insets = useSafeAreaInsets();
  const { getQuizProgress, currentPodcast } = useAudioContext();

  // Calculate bottom padding based on mini player visibility
  const bottomPadding = currentPodcast ? 120 : 40;

  useEffect(() => {
    loadQuizProgress();
  }, []);

  const loadQuizProgress = async () => {
    try {
      const progressData = await AsyncStorage.getItem('quiz_progress');
      if (progressData) {
        setQuizProgress(JSON.parse(progressData));
      }
    } catch (error) {
      console.error('Error loading quiz progress:', error);
    }
  };

  const getQuizStatus = (quizId: string): QuizStatus => {
    const progress = quizProgress[quizId];
    if (!progress) return 'unlocked'; // Quizzes are always available
    if (progress.isCompleted) {
      return progress.bestScore >= 70 ? 'passed' : 'completed';
    }
    return 'unlocked';
  };

  const completedQuizzes = mockQuizzes.filter(quiz => {
    const progress = quizProgress[quiz.id];
    return progress?.isCompleted;
  });

  const availableQuizzes = mockQuizzes.filter(quiz => {
    const progress = quizProgress[quiz.id];
    return !progress?.isCompleted; // All non-completed quizzes are available
  });

  const renderTabButton = (tab: typeof activeTab, title: string, count?: number) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-full mr-2 ${
        activeTab === tab 
          ? 'bg-blue-500' 
          : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <Text className={`font-medium ${
        activeTab === tab 
          ? 'text-white' 
          : 'text-gray-700 dark:text-gray-300'
      }`}>
        {title} {count !== undefined ? `(${count})` : ''}
      </Text>
    </TouchableOpacity>
  );

  const renderQuizzesTab = () => (
    <View className="space-y-6">
      {completedQuizzes.length > 0 && (
        <View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🏆 Completed Quizzes ({completedQuizzes.length})
          </Text>
          {completedQuizzes.map(quiz => {
            const podcast = mockPodcasts.find(p => p.id === quiz.podcastId);
            return (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                progress={quizProgress[quiz.id]}
                status={getQuizStatus(quiz.id)}
              />
            );
          })}
        </View>
      )}
      
      {availableQuizzes.length > 0 && (
        <View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            📝 Available Quizzes ({availableQuizzes.length})
          </Text>
          {availableQuizzes.map(quiz => {
            const podcast = mockPodcasts.find(p => p.id === quiz.podcastId);
            return (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                progress={quizProgress[quiz.id]}
                status={getQuizStatus(quiz.id)}
              />
            );
          })}
        </View>
      )}
      
      {mockQuizzes.length === 0 && (
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            No quizzes available yet.
          </Text>
        </View>
      )}
    </View>
  );
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        <View className="bg-gray-50">
          <View className="px-4 pt-6 pb-2">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Your Library
            </Text>
            <Text className="text-base text-gray-600">
              Manage your podcasts, quizzes and favorites
            </Text>
          </View>
        </View>

        {/* Navigation Bar */}
        <SegmentedControl activeSegment="learning" />

        <View className="px-6">
          {/* Tab Navigation */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {renderTabButton('recent', 'Recent')}
            {renderTabButton('favorites', 'Favorites')}
            {renderTabButton('downloads', 'Downloads')}
            {renderTabButton('quizzes', 'Quizzes', mockQuizzes.length)}
          </ScrollView>
        </View>
        
        <View className="flex-1 px-6">
          {activeTab === 'recent' && (
            <View className="space-y-4">
              <View className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Recently Played
                </Text>
                <Text className="text-gray-600">
                  No podcasts played yet
                </Text>
              </View>
            </View>
          )}
          
          {activeTab === 'favorites' && (
            <View className="space-y-4">
              <View className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Favorites
                </Text>
                <Text className="text-gray-600">
                  No favorite podcasts yet
                </Text>
              </View>
            </View>
          )}
          
          {activeTab === 'downloads' && (
            <View className="space-y-4">
              <View className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Downloaded
                </Text>
                <Text className="text-gray-600">
                  No downloaded podcasts
                </Text>
              </View>
            </View>
          )}
          
          {activeTab === 'quizzes' && renderQuizzesTab()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
