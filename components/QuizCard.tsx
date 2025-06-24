import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Quiz, QuizProgress, QuizStatus } from '@/types/quiz';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface QuizCardProps {
  quiz: Quiz;
  progress?: QuizProgress;
  status: QuizStatus;
  onPress?: () => void;
}

export function QuizCard({ quiz, progress, status, onPress }: QuizCardProps) {
  const getStatusColor = (status: QuizStatus) => {
    switch (status) {
      case 'locked':
        return 'bg-gray-400';
      case 'unlocked':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'passed':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: QuizStatus) => {
    switch (status) {
      case 'locked':
        return 'Locked - Complete 80% of podcast';
      case 'unlocked':
        return 'Available';
      case 'completed':
        return `Completed - ${progress?.bestScore}%`;
      case 'passed':
        return `Passed - ${progress?.bestScore}%`;
      default:
        return 'Unknown';
    }
  };

  const handlePress = () => {
    if (status === 'locked') {
      return; // Don't allow navigation for locked quizzes
    }
    
    if (onPress) {
      onPress();
    } else {
      router.push(`/quiz/${quiz.id}`);
    }
  };

  const isDisabled = status === 'locked';

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      className={`mb-4 rounded-lg overflow-hidden ${isDisabled ? 'opacity-50' : ''}`}
    >
      <ThemedView className="bg-white dark:bg-gray-800 shadow-md">
        {/* Quiz Image Header */}
        <View className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {quiz.imageUrl ? (
            <ImageBackground 
              source={{ uri: quiz.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-black/30" />
            </ImageBackground>
          ) : (
            <View className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-600" />
          )}
          
          {/* Status Badge */}
          <View className={`absolute top-3 right-3 px-3 py-1 rounded-full ${getStatusColor(status)}`}>
            <Text className="text-white text-xs font-medium">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>

          {/* Lock Icon for Locked Quizzes */}
          {status === 'locked' && (
            <View className="absolute inset-0 flex items-center justify-center">
              <View className="bg-black/50 p-3 rounded-full">
                <Text className="text-white text-2xl">🔒</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quiz Content */}
        <View className="p-4">
          <ThemedText type="subtitle" className="font-bold mb-2 text-lg">
            {quiz.title}
          </ThemedText>
          
          <ThemedText className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
            {quiz.description}
          </ThemedText>

          {/* Quiz Stats */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-xs mr-4">
                📝 {quiz.questions.length} questions
              </Text>
              <Text className="text-gray-500 text-xs">
                ⏱️ ~{quiz.estimatedTime} min
              </Text>
            </View>
            
            {progress?.attempts && progress.attempts > 0 && (
              <Text className="text-gray-500 text-xs">
                Attempts: {progress.attempts}
              </Text>
            )}
          </View>

          {/* Status Text */}
          <View className="flex-row items-center justify-between">
            <Text className={`text-sm font-medium ${
              status === 'locked' 
                ? 'text-gray-500' 
                : status === 'completed' || status === 'passed'
                ? 'text-green-600 dark:text-green-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {getStatusText(status)}
            </Text>

            {status !== 'locked' && (
              <View className="flex-row items-center">
                <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium mr-1">
                  {status === 'completed' || status === 'passed' ? 'Retake' : 'Start'}
                </Text>
                <Text className="text-blue-600 dark:text-blue-400">→</Text>
              </View>
            )}
          </View>

          {/* Progress Bar for Partially Completed */}
          {progress && progress.bestScore > 0 && (
            <View className="mt-3">
              <View className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <View 
                  className={`h-full ${
                    progress.bestScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${progress.bestScore}%` }}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Best Score: {progress.bestScore}%
              </Text>
            </View>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}