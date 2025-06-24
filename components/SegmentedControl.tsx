import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

type SegmentType = 'home' | 'learning' | 'explore';

interface SegmentedControlProps {
  activeSegment?: SegmentType;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ 
  activeSegment 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active segment from pathname if not provided
  const currentSegment: SegmentType = activeSegment || (
    pathname === '/library' ? 'learning' : 
    pathname === '/explore' ? 'explore' : 'home'
  );

  const handleSegmentPress = (segment: SegmentType) => {
    if (segment === currentSegment) return;
    
    if (segment === 'home') {
      router.push('/');
    } else if (segment === 'learning') {
      router.push('/library');
    } else if (segment === 'explore') {
      router.push('/explore');
    }
  };

  const segments = [
    {
      key: 'home' as SegmentType,
      title: 'Home',
      icon: 'home' as const,
    },
    {
      key: 'learning' as SegmentType,
      title: 'Learning',
      icon: 'school' as const,
    },
    {
      key: 'explore' as SegmentType,
      title: 'Explore',
      icon: 'compass' as const,
    },
  ];

  return (
    <View className="mx-auto w-96 bg-white rounded-[80px] shadow-lg mb-4">
      <View className="flex-row items-center justify-center px-2 py-0 h-20">
        {segments.map((segment) => {
          const isActive = currentSegment === segment.key;
          
          return (
            <TouchableOpacity
              key={segment.key}
              onPress={() => handleSegmentPress(segment.key)}
              className="min-w-28 flex-col items-center justify-center gap-1 pb-4 pt-3 px-0"
              activeOpacity={0.7}
            >
              <View className={`w-16 h-8 items-center justify-center rounded-full ${
                isActive ? 'bg-slate-950' : ''
              }`}>
                <Ionicons
                  name={segment.icon}
                  size={24}
                  color={isActive ? '#f8fafc' : '#64748b'}
                />
              </View>
              <Text className={`font-semibold text-xs text-center ${
                isActive 
                  ? 'text-slate-950' 
                  : 'text-slate-700'
              }`}>
                {segment.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};