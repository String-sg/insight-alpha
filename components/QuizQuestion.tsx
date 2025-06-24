import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { QuizQuestion as QuizQuestionType, QuizOption, Quiz } from '@/types/quiz';
import { mockPodcasts } from '@/data/podcasts';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  showCorrectAnswer?: boolean;
  onOptionSelect: (optionId: string) => void;
  disabled?: boolean;
  timeRemaining?: number;
  quiz?: Quiz;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  showCorrectAnswer,
  onOptionSelect,
  disabled = false,
  timeRemaining,
  quiz
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


  const getOptionStyle = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    
    if (isSelected) {
      return 'bg-[#dfd3ff]';
    } else {
      return 'bg-white/80 border border-gray-200';
    }
  };

  const getOptionBadgeStyle = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    
    if (isSelected) {
      return 'bg-[#a583ff]';
    } else {
      return 'bg-gray-200';
    }
  };

  const getOptionTextColor = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    
    if (isSelected) {
      return 'text-[#251e37]';
    } else {
      return 'text-[#3c3256]';
    }
  };


  const podcast = quiz ? mockPodcasts.find(p => p.id === quiz.podcastId) : null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className=""
    >
      {/* Quiz Badge and Podcast Info */}
      <View className="bg-white rounded-full mb-6" style={{ width: 269 }}>
        <View className="flex-row items-center p-1">
          <View className="bg-[#d4c3ff] rounded-full px-2 py-1">
            <Text className="text-[#3c3256] text-xs font-geist-semibold">
              Quiz
            </Text>
          </View>
          <Text className="flex-1 text-black text-xs ml-3 mr-2 font-geist-medium" numberOfLines={1}>
            {podcast?.title || 'Quiz'}
          </Text>
        </View>
      </View>

      {/* Question Text */}
      <Text className="text-black text-xl mb-6 leading-7 px-0 font-geist-medium">
        {question.question}
      </Text>

      {/* Options */}
      <View className="space-y-4 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <View key={option.id} className="relative">
              <TouchableOpacity
                onPress={() => !disabled && onOptionSelect(option.id)}
                disabled={disabled}
                className={`p-3 rounded-2xl ${getOptionStyle(option)}`}
              >
                <View className="flex-row items-center">
                  <View className={`rounded-lg px-2 py-1 mr-3 ${getOptionBadgeStyle(option)}`}>
                    <Text className={`text-xs font-geist-semibold ${getOptionTextColor(option)}`}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text className="flex-1 text-black text-sm font-geist">
                    {option.text}
                  </Text>
                </View>
              </TouchableOpacity>
              {isSelected && (
                <View 
                  className="absolute inset-0 rounded-2xl border-2 border-[#a583ff] pointer-events-none"
                  style={{ margin: -4 }}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Explanation (shown after answer) */}
      {showCorrectAnswer && question.explanation && (
        <View className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <View className="flex-row items-start">
            <Text className="text-blue-500 text-lg mr-2">💡</Text>
            <View className="flex-1">
              <Text className="text-blue-800 mb-1 font-geist-semibold">
                Explanation
              </Text>
              <Text className="text-blue-700 text-sm font-geist">
                {question.explanation}
              </Text>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
}