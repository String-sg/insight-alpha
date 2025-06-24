import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { QuizQuestion as QuizQuestionType, QuizOption } from '@/types/quiz';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  showCorrectAnswer?: boolean;
  onOptionSelect: (optionId: string) => void;
  disabled?: boolean;
  timeRemaining?: number;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  showCorrectAnswer,
  onOptionSelect,
  disabled = false,
  timeRemaining
}: QuizQuestionProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [question.id, fadeAnim, scaleAnim]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 bg-green-900 text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 bg-yellow-900 text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 bg-red-900 text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 bg-gray-700 text-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getOptionStyle = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    const isCorrect = option.isCorrect;
    
    if (showCorrectAnswer) {
      if (isCorrect) {
        return 'bg-green-100 border-green-500 bg-green-900 border-green-400';
      } else if (isSelected && !isCorrect) {
        return 'bg-red-100 border-red-500 bg-red-900 border-red-400';
      } else {
        return 'bg-gray-50 border-gray-200 bg-gray-800 border-gray-600';
      }
    } else if (isSelected) {
      return 'bg-blue-100 border-blue-500 bg-blue-900 border-blue-400';
    } else {
      return 'bg-white border-gray-200 hover:bg-gray-50 bg-gray-800 border-gray-600 hover:bg-gray-700';
    }
  };

  const getOptionIcon = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    const isCorrect = option.isCorrect;
    
    if (showCorrectAnswer) {
      if (isCorrect) {
        return '✅';
      } else if (isSelected && !isCorrect) {
        return '❌';
      } else {
        return '⚪';
      }
    } else if (isSelected) {
      return '🔵';
    } else {
      return '⚪';
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <ThemedView className="bg-white bg-gray-800 rounded-lg shadow-lg p-6 mx-4 mb-6">
        {/* Question Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Text className="text-lg font-bold text-gray-800 text-gray-200">
              Question {questionNumber}/{totalQuestions}
            </Text>
          </View>
          
          <View className="flex-row items-center space-x-2">
            {/* Difficulty Badge */}
            <View className={`px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
              <Text className="text-xs font-medium">
                {getDifficultyIcon(question.difficulty)} {question.difficulty.toUpperCase()}
              </Text>
            </View>
            
            {/* Timer */}
            {timeRemaining !== undefined && (
              <View className="bg-gray-100 bg-gray-700 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-gray-600 text-gray-300">
                  ⏱️ {Math.ceil(timeRemaining)}s
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-6">
          <View className="bg-gray-200 bg-gray-700 h-2 rounded-full overflow-hidden">
            <View 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </View>
        </View>

        {/* Question Text */}
        <ThemedText type="subtitle" className="text-lg font-semibold mb-6 leading-relaxed">
          {question.question}
        </ThemedText>

        {/* Options */}
        <View className="space-y-3">
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => !disabled && onOptionSelect(option.id)}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${getOptionStyle(option)}`}
            >
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">
                  {getOptionIcon(option)}
                </Text>
                <View className="flex-1">
                  <Text className={`text-base ${
                    showCorrectAnswer && option.isCorrect
                      ? 'font-semibold text-green-800 text-green-200'
                      : showCorrectAnswer && selectedOptionId === option.id && !option.isCorrect
                      ? 'font-semibold text-red-800 text-red-200'
                      : 'text-gray-800 text-gray-200'
                  }`}>
                    {String.fromCharCode(65 + index)}. {option.text}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation (shown after answer) */}
        {showCorrectAnswer && question.explanation && (
          <View className="mt-6 p-4 bg-blue-50 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <View className="flex-row items-start">
              <Text className="text-blue-500 text-lg mr-2">💡</Text>
              <View className="flex-1">
                <Text className="font-semibold text-blue-800 text-blue-200 mb-1">
                  Explanation
                </Text>
                <Text className="text-blue-700 text-blue-300 text-sm">
                  {question.explanation}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ThemedView>
    </Animated.View>
  );
}