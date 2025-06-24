import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Animated,
  // Dimensions
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QuizResult } from '@/types/quiz';

export default function QuizResultScreen() {
  const { resultData } = useLocalSearchParams<{ resultData: string }>();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [animatedScore] = useState(new Animated.Value(0));
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (resultData) {
      try {
        const parsedResult: QuizResult = JSON.parse(resultData);
        setResult(parsedResult);
        
        // Animate score
        Animated.timing(animatedScore, {
          toValue: parsedResult.scorePercentage,
          duration: 1500,
          useNativeDriver: false,
        }).start();
      } catch (error) {
        console.error('Error parsing result data:', error);
        router.back();
      }
    }
  }, [resultData, animatedScore]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 text-green-400';
    if (score >= 80) return 'text-blue-600 text-blue-400';
    if (score >= 70) return 'text-yellow-600 text-yellow-400';
    return 'text-red-600 text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 bg-green-900';
    if (score >= 80) return 'bg-blue-100 bg-blue-900';
    if (score >= 70) return 'bg-yellow-100 bg-yellow-900';
    return 'bg-red-100 bg-red-900';
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🎉';
    if (score >= 70) return '👍';
    return '💪';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!result) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 bg-gray-900">
        <StatusBar barStyle="dark-content" />
        <ThemedView className="flex-1 justify-center items-center">
          <Text className="text-lg">Loading results...</Text>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 bg-gray-900">
      <Stack.Screen 
        options={{
          title: 'Quiz Results',
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Main Score Card */}
          <ThemedView className={`rounded-xl p-8 mb-6 drop-shadow-lg ${getScoreBgColor(result.scorePercentage)}`}>
            <View className="items-center">
              <Text className="text-6xl mb-4">
                {getPerformanceIcon(result.scorePercentage)}
              </Text>
              
              <ThemedText type="title" className={`text-4xl font-bold mb-2 ${getScoreColor(result.scorePercentage)}`}>
                {result.scorePercentage}%
              </ThemedText>
              
              <Text className={`text-2xl font-semibold mb-4 ${getScoreColor(result.scorePercentage)}`}>
                Grade: {getGrade(result.scorePercentage)}
              </Text>
              
              <View className={`px-4 py-2 rounded-full ${result.passed ? 'bg-green-200 bg-green-800' : 'bg-red-200 bg-red-800'}`}>
                <Text className={`font-bold ${result.passed ? 'text-green-800 text-green-200' : 'text-red-800 text-red-200'}`}>
                  {result.passed ? '✅ PASSED' : '❌ FAILED'}
                </Text>
              </View>
            </View>
          </ThemedView>

          {/* Quiz Stats */}
          <ThemedView className="bg-white bg-gray-800 rounded-xl p-6 mb-6 drop-shadow-lg">
            <ThemedText type="subtitle" className="font-bold mb-4 text-center">
              Quiz Statistics
            </ThemedText>
            
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-2">✅</Text>
                  <Text className="text-gray-600 text-gray-300">Correct Answers</Text>
                </View>
                <Text className="font-bold text-lg text-green-600 text-green-400">
                  {result.correctAnswers}/{result.totalQuestions}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-2">⏱️</Text>
                  <Text className="text-gray-600 text-gray-300">Time Spent</Text>
                </View>
                <Text className="font-bold text-lg">
                  {formatTime(result.attempt.timeSpent)}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-2">📊</Text>
                  <Text className="text-gray-600 text-gray-300">Average per Question</Text>
                </View>
                <Text className="font-bold text-lg">
                  {formatTime(Math.floor(result.attempt.timeSpent / result.totalQuestions))}
                </Text>
              </View>
            </View>
          </ThemedView>

          {/* Feedback */}
          <ThemedView className="bg-white bg-gray-800 rounded-xl p-6 mb-6 drop-shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-2">💡</Text>
              <ThemedText type="subtitle" className="font-bold">
                Feedback
              </ThemedText>
            </View>
            <Text className="text-gray-700 text-gray-300 leading-relaxed">
              {result.feedback}
            </Text>
          </ThemedView>

          {/* Question Details Toggle */}
          <TouchableOpacity
            onPress={() => setShowDetails(!showDetails)}
            className="mb-4"
          >
            <ThemedView className="bg-white bg-gray-800 rounded-xl p-4 drop-shadow-lg">
              <View className="flex-row justify-between items-center">
                <ThemedText type="subtitle" className="font-bold">
                  Question Details
                </ThemedText>
                <Text className={`text-xl transform ${showDetails ? 'rotate-180' : 'rotate-0'}`}>
                  ▼
                </Text>
              </View>
            </ThemedView>
          </TouchableOpacity>

          {/* Question Details */}
          {showDetails && (
            <ThemedView className="bg-white bg-gray-800 rounded-xl p-6 mb-6 drop-shadow-lg">
              <View className="space-y-4">
                {result.quiz.questions.map((question, index) => {
                  const answer = result.attempt.answers.find(a => a.questionId === question.id);
                  const selectedOption = question.options.find(opt => opt.id === answer?.selectedOptionId);
                  const correctOption = question.options.find(opt => opt.isCorrect);
                  
                  return (
                    <View key={question.id} className="border-b border-gray-200 border-gray-700 pb-4 last:border-b-0">
                      <View className="flex-row items-start mb-2">
                        <Text className="text-lg mr-2">
                          {answer?.isCorrect ? '✅' : '❌'}
                        </Text>
                        <View className="flex-1">
                          <Text className="font-medium text-gray-800 text-gray-200 mb-1">
                            Q{index + 1}: {question.question}
                          </Text>
                          
                          {selectedOption && (
                            <Text className={`text-sm mb-1 ${
                              answer?.isCorrect 
                                ? 'text-green-600 text-green-400' 
                                : 'text-red-600 text-red-400'
                            }`}>
                              Your answer: {selectedOption.text}
                            </Text>
                          )}
                          
                          {!answer?.isCorrect && correctOption && (
                            <Text className="text-sm text-green-600 text-green-400">
                              Correct answer: {correctOption.text}
                            </Text>
                          )}
                          
                          <Text className="text-xs text-gray-500 mt-1">
                            Time: {formatTime(answer?.timeSpent || 0)} • {question.difficulty.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ThemedView>
          )}

          {/* Action Buttons */}
          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => router.push(`/quiz/${result.quiz.id}`)}
              className="bg-blue-600 rounded-xl p-4 drop-shadow-lg"
            >
              <Text className="text-white font-bold text-center text-lg">
                Retake Quiz
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/library')}
              className="bg-gray-600 bg-gray-700 rounded-xl p-4 drop-shadow-lg"
            >
              <Text className="text-white font-bold text-center text-lg">
                Back to Library
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/')}
              className="border-2 border-gray-300 border-gray-600 rounded-xl p-4"
            >
              <Text className="text-gray-700 text-gray-300 font-bold text-center text-lg">
                Discover More Podcasts
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}