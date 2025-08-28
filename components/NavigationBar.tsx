import { useRouter } from 'expo-router';
import { ChevronLeft, Upload } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { ShareDropdown } from './ShareDropdown';

interface NavigationBarProps {
  onBackPress?: () => void;
  showUploadButton?: boolean;
  onUploadPress?: () => void;
  backgroundColor?: string;
  style?: ViewStyle;
  contentInfo?: {
    title: string;
    subtitle?: string;
    description?: string;
    summary?: string;
  } | null;
  script?: string;
  sources?: any[];
  onExamineSources?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onBackPress,
  showUploadButton = true,
  onUploadPress,
  backgroundColor = 'transparent',
  style,
  contentInfo,
  script,
  sources,
  onExamineSources,
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
          contentInfo ? (
            <ShareDropdown 
              contentInfo={contentInfo}
              script={script}
              sources={sources}
              onExamineSources={onExamineSources}
            />
          ) : (
            <TouchableOpacity
              onPress={onUploadPress}
              className="w-10 h-10 items-center justify-center rounded-full bg-white"
            >
              <Upload size={20} color="#000" strokeWidth={2} />
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};