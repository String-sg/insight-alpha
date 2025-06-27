import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface ProfileHeaderProps {
  onProfilePress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onProfilePress }) => {
  return (
    <View className="flex-row items-center justify-between mx-4 mt-6 mb-4">
      <Text className="text-black text-2xl font-geist-semibold">
        Onward
      </Text>
      
      <TouchableOpacity
        onPress={onProfilePress}
        className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden items-center justify-center"
        activeOpacity={0.8}
      >
        <View className="w-8 h-8">
          <Image
            source={{ uri: 'https://picsum.photos/32/32?random=profile' }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};