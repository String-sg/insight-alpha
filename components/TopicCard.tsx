import { LinearGradient } from 'expo-linear-gradient';
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
  height = 480,
  showStats = true,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={{ height }}
    >
      <LinearGradient
        colors={gradientVia 
          ? [gradientFrom, gradientVia, gradientTo]
          : [gradientFrom, gradientTo]
        }
        locations={gradientVia ? [0.08, 0.43, 1.19] : [0, 1]}
        className="flex-1 rounded-[32px] p-6 relative"
        style={{ height: '100%' }}
      >
        {/* Icon in top right */}
        <View className="absolute top-6 right-6">
          {iconComponent ? (
            iconComponent
          ) : icon ? (
            <Image 
              source={icon}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          ) : null}
        </View>
        
        {/* Card content container */}
        <View className="flex-1 justify-end">
          {/* Content section */}
          <View className="gap-2">
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
                {podcasts} podcasts{notes !== undefined ? `\n${notes} notes` : ''}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};