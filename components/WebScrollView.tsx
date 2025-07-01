import React from 'react';
import { Platform, ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native';

interface WebScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  webStyle?: ViewStyle;
}

/**
 * A cross-platform ScrollView component that uses native browser scrolling on web
 * for better mobile browser compatibility (like Safari's minimizing bottom bar)
 */
export function WebScrollView({ 
  children, 
  style, 
  contentContainerStyle,
  webStyle,
  showsVerticalScrollIndicator = false,
  ...props 
}: WebScrollViewProps) {
  if (Platform.OS === 'web') {
    // On web, use NativeWind classes for styling
    return (
      <div 
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: 'touch',
          ...(style as any)
        }}
      >
        <div 
          className="max-w-3xl mx-auto w-full"
          style={contentContainerStyle as any}
        >
          {children}
        </div>
      </div>
    );
  }

  // On native platforms, use React Native's ScrollView
  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
    >
      {children}
    </ScrollView>
  );
}