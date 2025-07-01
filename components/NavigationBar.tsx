import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { ChevronLeft, Upload } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface NavigationBarProps {
  onBackPress?: () => void;
  showUploadButton?: boolean;
  onUploadPress?: () => void;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onBackPress,
  showUploadButton = true,
  onUploadPress,
  backgroundColor = 'transparent',
  style,
}) => {
  const router = useRouter();
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View 
      className="absolute top-0 left-0 right-0 z-10"
      style={[{ backgroundColor }, style]}
    >
      <View className="max-w-3xl mx-auto w-full flex-row items-center justify-between px-6 pt-4 pb-4">
        <TouchableOpacity
          onPress={handleBackPress}
          className="w-10 h-10 items-center justify-center rounded-full bg-white"
        >
          <ChevronLeft size={24} color="#000" strokeWidth={2} />
        </TouchableOpacity>
        
        {showUploadButton && (
          <TouchableOpacity
            onPress={onUploadPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-white"
          >
            <Upload size={20} color="#000" strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};