import { QuizOption } from '@/types/quiz';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from './Icon';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  selectedOption: QuizOption;
  correctOption: QuizOption;
  allOptions: QuizOption[];
  explanation: string;
  onContinue: () => void;
  onClose: () => void;
}

export function AnswerFeedback({
  isCorrect,
  selectedOption,
  correctOption,
  allOptions,
  explanation,
  onContinue,
  onClose,
}: AnswerFeedbackProps) {
  const getOptionLetter = (option: QuizOption) => {
    const index = allOptions.findIndex(opt => opt.id === option.id);
    return String.fromCharCode(65 + index);
  };

  return (
    <View className="flex-1" style={{ padding: 16 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-black text-xl font-geist-medium">
          {isCorrect ? 'Correct!' : 'Not quite right!'}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
        >
          <Icon name="close" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Your Answer */}
        <View className="mb-5">
          <Text className="text-black text-sm font-geist-medium mb-2">
            Your answer
          </Text>
          <View className="bg-white/80 border border-slate-200 rounded-2xl p-3">
            <View className="flex-row items-center">
              <View className="bg-[#ededed] rounded-lg px-2 py-1 mr-3">
                <Text className="text-[#572830] text-xs font-geist-semibold">
                  {getOptionLetter(selectedOption)}
                </Text>
              </View>
              <Text className="flex-1 text-black text-sm font-geist">
                {selectedOption.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Correct Answer */}
        {!isCorrect && (
          <View className="mb-5">
            <Text className="text-black text-sm font-geist-medium mb-2">
              Correct answer
            </Text>
            <View className="bg-[#d5ff88] rounded-2xl p-3">
              <View className="flex-row items-center">
                <View className="bg-[#b5ee4b] rounded-lg px-2 py-1 mr-3">
                  <Text className="text-[#251e37] text-xs font-geist-semibold">
                    {getOptionLetter(correctOption)}
                  </Text>
                </View>
                <Text className="flex-1 text-black text-sm font-geist">
                  {correctOption.text}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Explanation */}
        <View className="bg-[#f0f0f1] rounded-2xl p-3" style={{ shadowOpacity: 0, elevation: 0 }}>
          <View className="flex-col">
            <Text className="text-[#585858] text-sm font-geist-medium mb-1">
              Explanation
            </Text>
            <Text className="text-black text-sm font-geist leading-6">
              {explanation}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Continue Button */}
      <View className="pt-4">
        <TouchableOpacity
          className="bg-black rounded-full py-4 items-center justify-center"
          onPress={onContinue}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-geist-medium">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}