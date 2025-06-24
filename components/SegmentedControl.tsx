import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

type SegmentType = 'podcasts' | 'library';

interface SegmentedControlProps {
  activeSegment?: SegmentType;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ 
  activeSegment 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active segment from pathname if not provided
  const currentSegment: SegmentType = activeSegment || (pathname === '/library' ? 'library' : 'podcasts');

  const handleSegmentPress = (segment: SegmentType) => {
    if (segment === currentSegment) return;
    
    if (segment === 'podcasts') {
      router.push('/');
    } else {
      router.push('/library');
    }
  };

  const segments = [
    {
      key: 'podcasts' as SegmentType,
      title: 'Podcasts',
      icon: 'headset-outline' as const,
    },
    {
      key: 'library' as SegmentType,
      title: 'Library',
      icon: 'library-outline' as const,
    },
  ];

  return (
    <View className="mx-4 mb-4">
      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {segments.map((segment) => {
          const isActive = currentSegment === segment.key;
          
          return (
            <TouchableOpacity
              key={segment.key}
              onPress={() => handleSegmentPress(segment.key)}
              className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg ${
                isActive 
                  ? 'bg-white dark:bg-gray-700 shadow-sm' 
                  : ''
              }`}
              style={isActive ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              } : {}}
              activeOpacity={0.7}
            >
              <Ionicons
                name={segment.icon}
                size={18}
                color={isActive ? '#3B82F6' : '#6B7280'}
                style={{ marginRight: 8 }}
              />
              <Text className={`font-medium text-sm ${
                isActive 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
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