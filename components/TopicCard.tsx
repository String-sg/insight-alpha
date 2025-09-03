import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export interface TopicCardProps {
  id: string;
  title: string;
  subtitle: string;
  podcasts?: number;
  notes?: number;
  gradientFrom: string;
  gradientVia?: string;
  gradientTo: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  icon?: any;
  iconComponent?: React.ReactNode;
  height?: number;
  showStats?: boolean;
  onPress?: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  id,
  title,
  subtitle,
  podcasts,
  notes,
  gradientFrom,
  gradientVia,
  gradientTo,
  badgeBg,
  badgeText,
  textColor,
  icon,
  iconComponent,
  height = 360,
  showStats = true,
  onPress,
}) => {
  // Check if content is coming soon (podcasts count is 0)
  const isComingSoon = podcasts === 0;

  // Unified design for all cards with white background
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={{ height }}
      disabled={isComingSoon}
    >
      <View className="flex-1 rounded-[32px] p-6 relative bg-white">
        {/* Card content container */}
        <View className="flex-1 justify-center items-center">
          {/* Centered icon section */}
          <View className="items-center mb-6">
            {iconComponent ? (
              iconComponent
            ) : id === 'sen' ? (
              <Image 
                source={require('@/assets/images/sen.svg')}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            ) : id === 'wellbeing' ? (
              <Image 
                source={require('@/assets/images/chermentalh.svg')}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            ) : id === 'ai' ? (
              <Image 
                source={require('@/assets/images/learnAI.svg')}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            ) : icon ? (
              <Image 
                source={icon}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            ) : null}
          </View>
          
          {/* Content section */}
          <View className="w-full gap-2">
            <View className="gap-1">
              {/* Badge */}
              <View className={`${badgeBg} rounded-md px-2.5 py-0.5 self-start`}>
                <Text className={`${badgeText} font-geist-semibold text-xs`}>
                  {subtitle}
                </Text>
              </View>
              
              {/* Title */}
              <Text className={`${textColor} font-geist-semibold text-xl leading-7`}>
                {title}
              </Text>
            </View>
            
            {/* Stats */}
            {showStats && podcasts !== undefined && (
              <Text className={`${textColor} font-geist-regular text-sm leading-5`}>
                {podcasts} podcasts
              </Text>
            )}
          </View>
        </View>

        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <View className="absolute inset-0 rounded-[32px] bg-white/80 backdrop-blur-sm justify-center items-center">
            <View className="bg-gray-900/90 rounded-2xl px-6 py-4 items-center">
              <Text className="text-white font-geist-semibold text-lg mb-1">
                Coming Soon
              </Text>
              <Text className="text-gray-300 font-geist-regular text-sm text-center">
                Content will be available shortly
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

};