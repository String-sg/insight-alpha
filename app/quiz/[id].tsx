import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockQuizzes } from '@/data/quizzes';
import { QuizQuestion } from '@/components/QuizQuestion';
import { ThemedView } from '@/components/ThemedView';
import { 
  Quiz, 
  QuizAttempt, 
  QuizAnswer, 
  QuizProgress,
  QuizResult 
} from '@/types/quiz';

const QUIZ_STORAGE_KEY = 'quiz_attempts';
const QUIZ_PROGRESS_KEY = 'quiz_progress';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  // const [showResult, setShowResult] = useState(false); // Unused for now
  const [isLoading, setIsLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [quizStartTime] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadQuiz = useCallback(async () => {
    try {
      const foundQuiz = mockQuizzes.find(q => q.id === id);
      if (!foundQuiz) {
        Alert.alert('Error', 'Quiz not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      // Quizzes are always available - no unlock check needed

      setQuiz(foundQuiz);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading quiz:', error);
      Alert.alert('Error', 'Failed to load quiz', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [id]);

  useEffect(() => {
    loadQuiz();
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id, loadQuiz]);

  const handleOptionSelect = (optionId: string) => {
    if (!quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    const questionTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    if (!selectedOption) return;

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect: selectedOption.isCorrect,
      timeSpent: questionTimeSpent
    };

    setAnswers(prev => [...prev, answer]);
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setQuestionStartTime(Date.now());
      } else {
        finishQuiz([...answers, answer]);
      }
    }, 1500);
  };

  const finishQuiz = async (finalAnswers: QuizAnswer[]) => {
    if (!quiz) return;

    try {
      const correctAnswers = finalAnswers.filter(answer => answer.isCorrect).length;
      const scorePercentage = Math.round((correctAnswers / quiz.questions.length) * 100);
      const totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000);

      const attempt: QuizAttempt = {
        id: `attempt_${Date.now()}`,
        quizId: quiz.id,
        podcastId: quiz.podcastId,
        answers: finalAnswers,
        score: scorePercentage,
        totalQuestions: quiz.questions.length,
        completedAt: new Date(),
        timeSpent: totalTimeSpent
      };

      const result: QuizResult = {
        attempt,
        quiz,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        scorePercentage,
        passingScore: 70,
        passed: scorePercentage >= 70,
        feedback: generateFeedback(scorePercentage)
      };

      // Save attempt
      await saveQuizAttempt(attempt);
      
      // Update progress
      await updateQuizProgress(quiz.id, scorePercentage);

      // Navigate to results
      router.push({
        pathname: '/quiz/result',
        params: { 
          resultData: JSON.stringify(result)
        }
      });
    } catch (error) {
      console.error('Error finishing quiz:', error);
      Alert.alert('Error', 'Failed to save quiz results');
    }
  };

  const saveQuizAttempt = async (attempt: QuizAttempt) => {
    try {
      const existingData = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
      const attempts: QuizAttempt[] = existingData ? JSON.parse(existingData) : [];
      attempts.push(attempt);
      await AsyncStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  const updateQuizProgress = async (quizId: string, score: number) => {
    try {
      const progressData = await AsyncStorage.getItem(QUIZ_PROGRESS_KEY);
      const progress: Record<string, QuizProgress> = progressData ? JSON.parse(progressData) : {};
      
      const currentProgress = progress[quizId] || {
        quizId,
        podcastId: quiz?.podcastId || '',
        isUnlocked: true,
        isCompleted: false,
        bestScore: 0,
        attempts: 0
      };

      currentProgress.isCompleted = true;
      currentProgress.bestScore = Math.max(currentProgress.bestScore, score);
      currentProgress.attempts += 1;
      currentProgress.lastAttemptDate = new Date();

      progress[quizId] = currentProgress;
      await AsyncStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error updating quiz progress:', error);
    }
  };

  const generateFeedback = (score: number): string => {
    if (score >= 90) {
      return "Excellent! You have a thorough understanding of the podcast content.";
    } else if (score >= 80) {
      return "Great job! You understood most of the key concepts discussed.";
    } else if (score >= 70) {
      return "Good work! You passed the quiz with a solid understanding.";
    } else if (score >= 60) {
      return "Not bad, but you might want to listen to the podcast again for better comprehension.";
    } else {
      return "Consider re-listening to the podcast to better understand the content before retaking the quiz.";
    }
  };

  const handleExitQuiz = () => {
    try {
      console.log('Exit quiz button pressed');
      router.back();
    } catch (error) {
      console.error('Error navigating back:', error);
      // Fallback: try to navigate to home
      router.push('/(tabs)/');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 bg-gray-900">
        <StatusBar barStyle="dark-content" />
        <ThemedView className="flex-1 justify-center items-center">
          <Text className="text-lg">Loading quiz...</Text>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!quiz) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 bg-gray-900">
        <StatusBar barStyle="dark-content" />
        <ThemedView className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600 text-gray-400">Quiz not found</Text>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const hasSelectedAnswer = answers.some(answer => answer.questionId === currentQuestion.id);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 bg-gray-900">
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="dark-content" />

      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white bg-gray-900 border-b border-gray-200 border-gray-700">
        <TouchableOpacity
          onPress={handleExitQuiz}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 bg-gray-800"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-900 text-white">
          {quiz.title}
        </Text>
        
        <View className="w-10" />
      </View>

      {/* Timer Header */}
      <View className="px-4 py-3 bg-white bg-gray-900 border-b border-gray-200 border-gray-700">
        <View className="flex-row justify-center">
          <Text className="text-gray-500 text-gray-400 text-sm">
            ⏱️ {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            onOptionSelect={handleOptionSelect}
            disabled={hasSelectedAnswer}
            showCorrectAnswer={hasSelectedAnswer}
            selectedOptionId={
              answers.find(answer => answer.questionId === currentQuestion.id)?.selectedOptionId
            }
          />
        </View>
      </ScrollView>

      {/* Bottom Info */}
      <ThemedView className="px-4 py-3 border-t border-gray-200 border-gray-700">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Text>
          <Text className="text-gray-500 text-sm">
            {answers.filter(a => a.isCorrect).length} correct so far
          </Text>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}