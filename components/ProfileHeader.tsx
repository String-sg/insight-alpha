import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface ProfileHeaderProps {
  onProfilePress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onProfilePress }) => {
  const router = useRouter();
  
  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/profile');
    }
  };
  return (
    <View className="flex-row items-center justify-between mx-6 mt-6 mb-4">
      <Text className="text-black text-2xl font-geist-semibold">
        Onward
      </Text>
      
      <TouchableOpacity
        onPress={handleProfilePress}
        className="w-10 h-10 rounded-full overflow-hidden"
        activeOpacity={0.8}
      >
        <Image
          source={require('@/assets/images/cover-album.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};