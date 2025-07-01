import { educationalContent } from '@/data/educational-content';
import { Quiz, QuizOption, QuizQuestion as QuizQuestionType } from '@/types/quiz';
import React, { useEffect, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

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
      return 'bg-white/80 border border-black';
    } else {
      return 'bg-white/80';
    }
  };

  const getOptionBadgeStyle = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    
    if (isSelected) {
      return 'bg-black';
    } else {
      return 'bg-[#ededed]';
    }
  };

  const getOptionTextColor = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    
    if (isSelected) {
      return 'text-white';
    } else {
      return 'text-[#3c3256]';
    }
  };

  const getOptionLabelTextColor = (option: QuizOption) => {
    const isSelected = selectedOptionId === option.id;
    
    if (isSelected) {
      return 'text-black';
    } else {
      return 'text-black';
    }
  };


  const podcast = quiz ? educationalContent.find(content => content.id === quiz.podcastId) : null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className=""
    >
      {/* Central Gradient Badge with Video Background */}
      <View className="items-center mb-8">
        <View className="w-[120px] h-[120px] rounded-full overflow-hidden">
          <Video
            source={require('@/assets/video/bg-mesh-gradient.mp4')}
            style={{
              width: 120,
              height: 120,
            }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
            volume={0}
          />
        </View>
      </View>

      {/* Question Text */}
      <Text className="text-black text-xl mb-8 leading-7 font-geist-medium">
        {question.question}
      </Text>

      {/* Options */}
      <View className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => !disabled && onOptionSelect(option.id)}
              disabled={disabled}
              className={`p-3 rounded-2xl h-16 justify-center ${getOptionStyle(option)}`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <View className={`rounded-lg px-2 py-1 ${getOptionBadgeStyle(option)}`}>
                  <Text className={`text-xs font-geist-semibold ${getOptionTextColor(option)}`}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text className={`flex-1 text-sm font-geist ${getOptionLabelTextColor(option)}`}>
                  {option.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

    </Animated.View>
  );
}