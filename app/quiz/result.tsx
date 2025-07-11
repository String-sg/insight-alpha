import { Icon } from '@/components/Icon';
import { QuizResult } from '@/types/quiz';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

export default function QuizResultScreen() {
  const { resultData, podcastId } = useLocalSearchParams<{ resultData: string; podcastId?: string }>();
  const [result, setResult] = useState<QuizResult | null>(null);
  const confettiRef = useRef<any>(null);

  // Always trigger confetti when result becomes available
  useEffect(() => {
    if (result) {
      console.log('Result is now available, triggering confetti...');
      
      // First confetti burst
      setTimeout(() => {
        console.log('First confetti burst, ref:', confettiRef.current);
        if (confettiRef.current) {
          confettiRef.current.start();
        }
      }, 300);
      
      // Second confetti burst with 3000ms delay after first one
      setTimeout(() => {
        console.log('Second confetti burst');
        if (confettiRef.current) {
          confettiRef.current.start();
        }
      }, 3300); // 300ms + 3000ms = 3300ms total
    }
  }, [result]);

  useEffect(() => {
    if (resultData) {
      try {
        const parsedResult: QuizResult = JSON.parse(resultData);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing result data:', error);
        router.back();
      }
    }
  }, [resultData]);

  if (!result) {
    return (
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg">Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen 
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <StatusBar barStyle="dark-content" />

      {/* Enhanced Confetti Animation */}
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{x: width / 2, y: 0}}
        explosionSpeed={200}
        fallSpeed={1500}
        fadeOut={true}
        autoStart={false}
        colors={['#FFE66D', '#FF6B6B', '#4ECDC4', '#95E1D3', '#C7CEEA', '#FFD93D', '#A6E432', '#D5FF88']}
      />

      <View className="flex-1">
        {/* Main Content */}
        <View className="flex-1 items-center justify-center px-4">
          {/* Light Bulb Illustration */}
          <View className="mb-6">
            <Image 
              source={require('@/assets/images/illustration-lightbulb.png')}
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text className="text-black text-[20px] font-geist-medium leading-7 mb-10 text-center">
            That was insightful!
          </Text>

          {/* Success Message Card */}
          <View className="bg-white/50 border border-black/5 rounded-[20px] p-0 w-full max-w-[361px] overflow-hidden">
            {/* Top Message Section */}
            <View className="px-4 py-4">
              <Text className="text-[#585858] text-[14px] leading-6 text-center font-normal">
                You have earned completion status! Track completed topics on your profile
              </Text>
            </View>

            {/* Progress Milestone Section */}
            <View className="bg-white rounded-[20px] px-4 py-4">
              <View className="flex-row items-center justify-between">
                {/* Play Icon - Left */}
                <View className="w-8 h-8 bg-[#D5FF88] rounded-full items-center justify-center z-10">
                  <Icon name="play" size={16} color="#3D4A24" />
                </View>
                
                {/* First Progress Line */}
                <View className="flex-1 mx-3 relative">
                  {/* Background Line */}
                  <View className="h-3 bg-[#E9E9E9] rounded-full">
                    {/* Filled Progress Line */}
                    <View className="h-3 bg-[#A6E432] rounded-full w-full" />
                  </View>
                </View>
                
                {/* Headphones Icon - Center */}
                <View className="w-8 h-8 bg-[#D5FF88] rounded-full items-center justify-center z-10">
                  <Icon name="headset" size={16} color="#3D4A24" />
                </View>
                
                {/* Second Progress Line */}
                <View className="flex-1 mx-3 relative">
                  {/* Background Line */}
                  <View className="h-3 bg-[#E9E9E9] rounded-full">
                    {/* Filled Progress Line */}
                    <View className="h-3 bg-[#A6E432] rounded-full w-full" />
                  </View>
                </View>
                
                {/* Lightbulb Icon - Right */}
                <View className="w-8 h-8 bg-[#D5FF88] rounded-full items-center justify-center z-10">
                  <Icon name="bulb" size={16} color="#3D4A24" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Done Button */}
        <View className="px-4 pb-12">
          <TouchableOpacity
            onPress={() => router.push('/')}
            className="bg-black rounded-full py-4 w-full"
          >
            <Text className="text-white font-inter-medium text-[16px] leading-6 text-center">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}